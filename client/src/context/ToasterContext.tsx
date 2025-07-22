"use client";

import Toaster from "@/components/general/Toaster";
import { ToastConfig, ToasterContextValue } from "@/types/toasterTypes";
import { createContext, useContext, useState } from "react";

const ToasterContext = createContext<ToasterContextValue | undefined>(
  undefined
);

// Provider component
export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const addToast = (config: Omit<ToastConfig, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: ToastConfig = {
      ...config,
      id,
      duration: config.duration ?? 5000, // Default 5 seconds
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>
  ) => {
    return addToast({ ...options, type: "success", title, message });
  };

  const error = (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>
  ) => {
    return addToast({ ...options, type: "error", title, message });
  };

  const info = (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>
  ) => {
    return addToast({ ...options, type: "info", title, message });
  };

  const warning = (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>
  ) => {
    return addToast({ ...options, type: "warning", title, message });
  };

  const prompt = (
    title: string,
    message?: string,
    onSubmit?: (value: string) => void,
    options?: Partial<ToastConfig>
  ) => {
    return addToast({
      ...options,
      type: "info",
      title,
      message,
      showInput: true,
      showButton: true,
      buttonText: "Submit",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      duration: 0, // Don't auto-close prompts
      onButtonClick: (inputValue) => {
        if (inputValue && onSubmit) {
          onSubmit(inputValue);
        }
      },
      onCancel: options?.onCancel || (() => {}),
    });
  };

  const confirmer = (
    title: string,
    message?: string,
    onConfirm?: () => void,
    options?: Partial<ToastConfig>
  ) => {
    return addToast({
      ...options,
      type: "warning",
      title,
      message,
      showButton: true,
      buttonText: "Confirm",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      duration: 0, // Don't auto-close confirmations
      onButtonClick: () => {
        if (onConfirm) {
          onConfirm();
          clearAllToasts();
        }
      },
      onCancel: options?.onCancel || (() => {}),
    });
  };

  const contextValue: ToasterContextValue = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    info,
    warning,
    prompt,
    confirmer,
  };

  return (
    <ToasterContext.Provider value={contextValue}>
      {children}
      <Toaster toasts={toasts} onRemoveToast={removeToast} />
    </ToasterContext.Provider>
  );
};

// Hook for managing toasts
export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
};
