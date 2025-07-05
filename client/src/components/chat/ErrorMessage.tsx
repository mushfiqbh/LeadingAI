import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-6 max-w-md w-full shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-red-800 font-semibold">Something went wrong</p>
            <p className="text-red-600 text-sm mt-1 leading-relaxed">{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-2.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-105"
              title="Retry"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};