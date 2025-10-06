'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UploadResult {
  success: boolean;
  data?: {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
  };
  error?: string;
}

export default function CloudinaryTestPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testUpload = async (file: File) => {
    console.log('🧪 Testing Cloudinary upload...');
    console.log('📁 File:', file.name, file.size, file.type);
    
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'faithbliss/test');
      formData.append('photoNumber', '1');

      console.log('📤 Sending to /api/upload...');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setResult(data);
      console.log('✅ Upload successful!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('❌ Upload failed:', errorMsg);
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('🎯 File selected:', file.name);
      testUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          Cloudinary Upload Test
        </h1>

        <div className="mb-6">
          <label className="block text-white mb-2">
            Select an image to test upload:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-white bg-gray-700 p-2 rounded"
          />
        </div>

        {uploading && (
          <div className="bg-blue-900 text-blue-200 p-4 rounded mb-4">
            ⏳ Uploading to Cloudinary...
          </div>
        )}

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded mb-4">
            <h3 className="font-bold mb-2">❌ Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-900 text-green-200 p-4 rounded mb-4">
            <h3 className="font-bold mb-2">✅ Success!</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.data?.secure_url && (
              <div className="mt-4">
                <p className="mb-2">Preview:</p>
                <Image 
                  src={result.data.secure_url} 
                  alt="Uploaded" 
                  width={result.data.width}
                  height={result.data.height}
                  className="max-w-full h-auto rounded"
                />
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-700 text-gray-300 p-4 rounded text-sm">
          <h3 className="font-bold mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open browser DevTools console (F12)</li>
            <li>Select an image file</li>
            <li>Watch the console for detailed logs</li>
            <li>Check if upload succeeds or fails</li>
          </ol>
        </div>

        <div className="mt-4 bg-yellow-900 text-yellow-200 p-4 rounded text-sm">
          <h3 className="font-bold mb-2">🔍 Common Issues:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>401 Unauthorized:</strong> Not logged in</li>
            <li><strong>500 Server Error:</strong> Cloudinary config wrong</li>
            <li><strong>Network Error:</strong> Server not running</li>
            <li><strong>CORS Error:</strong> Cloudinary blocking request</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
