"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Check, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { ToastConfig } from "@/types/toasterTypes";

interface ToasterProps {
  toasts: ToastConfig[];
  onRemoveToast: (id: string) => void;
}

interface ToastItemProps {
  toast: ToastConfig;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [inputValue, setInputValue] = useState(toast.inputValue || "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onRemove(toast.id);
      toast.onClose?.();
    }, 200);
  }, [onRemove, toast]);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  const handleButtonClick = () => {
    toast.onButtonClick?.(inputValue);
    if (toast.showInput) {
      handleClose();
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <Check className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "info":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div
      className={`transform transition-all duration-200 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-md mx-auto p-4 rounded-xl shadow-lg backdrop-blur-sm ${getColors()}`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
          aria-label="Close toast"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Content */}
        <div className="pr-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <h3 className="font-semibold text-gray-900">{toast.title}</h3>
          </div>

          {/* Message */}
          {toast.message && (
            <p className="text-sm text-gray-700 mb-3">{toast.message}</p>
          )}

          {/* Input */}
          {toast.showInput && (
            <div className="mb-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={toast.inputPlaceholder || "Enter value..."}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                autoFocus
              />
            </div>
          )}

          {/* Button(s) */}
          {(toast.showButton || toast.showCancelButton) && (
            <div className="flex justify-end gap-2">
              {toast.showCancelButton && (
                <button
                  onClick={() => {
                    toast.onCancel?.();
                    handleClose();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {toast.cancelButtonText || "Cancel"}
                </button>
              )}
              {toast.showButton && (
                <button
                  onClick={handleButtonClick}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {toast.buttonText || "OK"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Toaster: React.FC<ToasterProps> = ({ toasts, onRemoveToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div className="flex items-start justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-4 pointer-events-auto">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={onRemoveToast} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toaster;
