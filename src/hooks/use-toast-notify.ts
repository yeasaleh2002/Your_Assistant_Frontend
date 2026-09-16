"use client";

import * as React from "react";
import toast, { ToastOptions } from "react-hot-toast";

const BASE_TOAST_STYLE: React.CSSProperties = {
  borderRadius: "12px",
  fontSize: "13px",
  fontWeight: "500",
  padding: "10px 16px",
  background: "#0f172a",
  color: "#f8fafc",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
};

/**
 * Minimalist, elegant Toast notification helper
 * Provides consistent typography, flat vector styling, and deduplication.
 */
export function useToastNotify() {
  const notifySuccess = React.useCallback((message: string, id?: string) => {
    return toast.success(message, {
      id: id || message,
      duration: 3500,
      style: {
        ...BASE_TOAST_STYLE,
        borderLeft: "4px solid #10b981", // emerald
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#0f172a",
      },
    });
  }, []);

  const notifyError = React.useCallback((error: unknown, fallbackMessage = "Operation failed", id?: string) => {
    let message = fallbackMessage;
    if (typeof error === "string") {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return toast.error(message, {
      id: id || message,
      duration: 4500,
      style: {
        ...BASE_TOAST_STYLE,
        borderLeft: "4px solid #f43f5e", // rose
      },
      iconTheme: {
        primary: "#f43f5e",
        secondary: "#0f172a",
      },
    });
  }, []);

  const notifyInfo = React.useCallback((message: string, id?: string) => {
    return toast(message, {
      id: id || message,
      duration: 3000,
      style: {
        ...BASE_TOAST_STYLE,
        borderLeft: "4px solid #6366f1", // indigo
      },
      icon: "⚡",
    });
  }, []);

  const notifyPromise = React.useCallback(
    <T,>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string },
      options?: ToastOptions
    ) => {
      return toast.promise(
        promise,
        {
          loading: messages.loading,
          success: messages.success,
          error: (err) => (err instanceof Error ? err.message : messages.error),
        },
        {
          style: BASE_TOAST_STYLE,
          ...options,
        }
      );
    },
    []
  );

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyPromise,
    dismiss: toast.dismiss,
  };
}
