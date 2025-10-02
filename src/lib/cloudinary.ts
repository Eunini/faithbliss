// lib/cloudinary.ts - Client-side Cloudinary utilities
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

export class CloudinaryService {
  /**
   * Upload image to Cloudinary via API route
   * @param imageFile - The image file
   * @param folder - Optional folder name for organization
   * @param userId - User ID for unique naming
   * @param photoNumber - Photo number (1, 2, or 3)
   * @returns Promise with upload result
   */
  static async uploadImage(
    imageFile: File,
    folder: string = 'faithbliss/profile-photos',
    userId?: string,
    photoNumber?: number
  ): Promise<CloudinaryUploadResult> {
    try {
      if (!imageFile || !(imageFile instanceof File)) {
        throw new Error('Valid image file is required');
      }

      // Create FormData for API request
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('folder', folder);
      if (photoNumber) {
        formData.append('photoNumber', photoNumber.toString());
      }

      // Upload via API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      return result.data;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Upload multiple images
   * @param imageFiles - Array of image files
   * @param folder - Optional folder name
   * @param userId - User ID for unique naming
   * @returns Promise with array of upload results
   */
  static async uploadMultipleImages(
    imageFiles: File[],
    folder: string = 'faithbliss/profile-photos',
    userId?: string
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = imageFiles.map((file, index) => 
      this.uploadImage(file, folder, userId, index + 1)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Generate optimized image URLs with transformations
   * @param imageUrl - The Cloudinary image URL
   * @param options - Transformation options
   * @returns Optimized image URL
   */
  static getOptimizedUrl(
    imageUrl: string, 
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    const {
      width = 400,
      height = 400,
      crop = 'fill',
      quality = 'auto:good',
      format = 'webp'
    } = options;

    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return imageUrl; // Return original URL if it's not a Cloudinary URL
    }

    // Build transformation string
    const transformations = [
      `w_${width}`,
      `h_${height}`,
      `c_${crop}`,
      `q_${quality}`,
      `f_${format}`
    ].join(',');

    // Insert transformations into Cloudinary URL
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length === 2) {
      return `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;
    }

    return imageUrl; // Return original if transformation fails
  }
}

export default CloudinaryService;