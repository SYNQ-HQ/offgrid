"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const Toast = ({ id, type, title, message, onDismiss }) => {
  const icons = {
    success: <Check className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "flex w-full max-w-sm items-start gap-4 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5",
        "dark:bg-zinc-950 dark:ring-white/10"
      )}
    >
      <div className="flex-shrink-0 pt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-1 grid gap-1">
        {title && <h3 className="text-sm font-medium leading-none">{title}</h3>}
        {message && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 rounded-md p-1 opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "info", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, message: description, type: variant };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
    
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
