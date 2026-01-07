/**
 * Toast Notification Wrapper
 * Integrates react-hot-toast with glassmorphism styling
 */

'use client';

import React from 'react';
import { Toaster, toast as hotToast } from 'react-hot-toast';

/**
 * Custom toast wrapper functions
 */
export const toast = {
  success: (message: string) => {
    hotToast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  },

  error: (message: string) => {
    hotToast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  },

  loading: (message: string) => {
    return hotToast.loading(message, {
      position: 'top-right',
    });
  },

  dismiss: (toastId: string) => {
    hotToast.dismiss(toastId);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return hotToast.promise(promise, messages, {
      position: 'top-right',
    });
  },
};

/**
 * Toast container component with glassmorphism styling
 */
export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Success toast styling
        success: {
          style: {
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        // Error toast styling
        error: {
          style: {
            background: 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        // Loading toast styling
        loading: {
          style: {
            background: 'rgba(59, 130, 246, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
          },
        },
        // Default styling
        style: {
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        },
      }}
    />
  );
}
