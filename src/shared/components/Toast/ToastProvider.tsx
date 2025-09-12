import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastProps } from './Toast';

interface ToastData {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5,
  position = 'top-right'
}) => {
  const [toasts, setToasts] = useState<(ToastData & { position: string })[]>([]);

  const generateId = () => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const showToast = (toastData: Omit<ToastData, 'id'>) => {
    const id = generateId();
    const newToast = { ...toastData, id, position };

    setToasts(prev => {
      // Remove oldest toasts if we exceed maxToasts
      const updatedToasts = prev.length >= maxToasts 
        ? prev.slice(1) 
        : prev;
      
      return [...updatedToasts, newToast];
    });
  };

  const showSuccess = (title: string, message?: string, duration?: number) => {
    showToast({ title, message, type: 'success', duration });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    showToast({ title, message, type: 'error', duration });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    showToast({ title, message, type: 'warning', duration });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    showToast({ title, message, type: 'info', duration });
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <div style={{ position: 'relative', zIndex: 9999 }}>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              // Stagger toasts vertically
              transform: `translateY(${index * 80}px)`,
              zIndex: 9999 - index,
            }}
          >
            <Toast
              id={toast.id}
              title={toast.title}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              position={position}
              onClose={dismissToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};