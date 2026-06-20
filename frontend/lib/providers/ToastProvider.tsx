"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage["type"], title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastMessage["type"], title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type, title };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Floating notification layer container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-lg shadow-lg border transition-all duration-300 transform translate-y-0 glassmorphism flex flex-col gap-1 ${
              toast.type === "success" ? "border-telemetry-healthy/30 border-l-4 border-l-telemetry-healthy" :
              toast.type === "error" ? "border-telemetry-critical/30 border-l-4 border-l-telemetry-critical" :
              toast.type === "warning" ? "border-telemetry-warning/30 border-l-4 border-l-telemetry-warning" :
              "border-telemetry-neutral/30 border-l-4 border-l-telemetry-neutral"
            }`}
            role="alert"
          >
            {toast.title && <span className="font-bold text-sm text-text-deep">{toast.title}</span>}
            <span className="text-xs text-text-muted">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-2 right-2 text-text-muted hover:text-text-deep text-sm p-1"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToasts must be used within a ToastProvider");
  }
  return context;
};
