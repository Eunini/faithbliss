import React from 'react';
import { Toast } from '@/contexts/ToastContext';
import { ToastItem } from '@/components/Toast/ToastItem';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 pt-4 px-4 pointer-events-none">
      <div className="flex flex-col items-center space-y-2 max-w-md w-full">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};