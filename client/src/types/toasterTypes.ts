export interface ToastConfig {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: (inputValue?: string) => void;
  onClose?: () => void;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  onCancel?: () => void;
}

export interface ToasterContextValue {
  toasts: ToastConfig[];
  addToast: (config: Omit<ToastConfig, "id">) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>
  ) => string;
  error: (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>
  ) => string;
  info: (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>
  ) => string;
  warning: (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>
  ) => string;
  prompt: (
    title: string,
    message?: string,
    onSubmit?: (value: string) => void,
    options?: Partial<ToastConfig>
  ) => string;
  confirmer: (
    title: string,
    message?: string,
    onConfirm?: () => void,
    options?: Partial<ToastConfig>
  ) => string;
}
