import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
              title="Retry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};