"use client";

import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";
import { cn } from "@/lib/utils";

type ToastTypes = "success" | "error" | "info" | "warning";

interface CustomToastProps {
  message: string;
  type?: ToastTypes;
  description?: string;
};

const toastIcons = {
  success: <CheckCircle className="h-6 w-6 text-green-500" />,
  error: <XCircle className="h-6 w-6 text-red-500" />,
  warning: <AlertCircle className="h-6 w-6 text-amber-500" />,
  info: <Info className="h-6 w-6 text-blue-500" />,
};

const toastStyles = {
  success: "border-l-4 border-green-500 bg-gradient-to-br from-green-50 to-green-100 text-green-900 shadow-lg shadow-green-100/50",
  error: "border-l-4 border-red-500 bg-gradient-to-br from-red-50 to-red-100 text-red-900 shadow-lg shadow-red-100/50",
  warning: "border-l-4 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-900 shadow-lg shadow-amber-100/50",
  info: "border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 shadow-lg shadow-blue-100/50",
};

export function CustomToast({ message, type = "success", description }: CustomToastProps) {
  return (
    <div className={cn(
      "flex w-full items-start gap-3 rounded-lg p-4 shadow-lg",
      toastStyles[type]
    )}>
      <div className="flex-shrink-0">{toastIcons[type]}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{message}</h3>
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
      <button 
        onClick={() => sonnerToast.dismiss()} 
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          maxWidth: '600px',
          width: '95%',
          padding: '0',
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        },
        className: 'custom-toast-wrapper scale-105',
      }}
      closeButton
      richColors
      expand
      duration={4000}
    />
  );
}

type ToastFunction = (props: CustomToastProps) => void;

const createToast: ToastFunction = ({ message, type = "success", description }) => {
  sonnerToast.custom(() => (
    <CustomToast message={message} type={type} description={description} />
  ));
};

export const toast = {
  success: (message: string, description?: string) => 
    createToast({ message, type: "success", description }),
  error: (message: string, description?: string) => 
    createToast({ message, type: "error", description }),
  warning: (message: string, description?: string) => 
    createToast({ message, type: "warning", description }),
  info: (message: string, description?: string) => 
    createToast({ message, type: "info", description }),
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
};