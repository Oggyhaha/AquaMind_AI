import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import './toast-animations.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  isExiting?: boolean;
}

export interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastCardProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onClose }) => {
  const { id, type, title, message, duration = 5000, isExiting } = toast;
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);

  const handleClose = useCallback(() => {
    onClose(id);
  }, [id, onClose]);

  useEffect(() => {
    if (isPaused || isExiting) return;

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      handleClose();
    }, remainingTimeRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, isExiting, handleClose]);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const config = {
    success: {
      icon: CheckCircle2,
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20',
      progressBar: 'bg-emerald-500 dark:bg-emerald-400',
      borderAccent: 'border-l-4 border-l-emerald-500 dark:border-l-emerald-400',
      glow: 'shadow-emerald-500/5 dark:shadow-emerald-950/20',
    },
    error: {
      icon: XCircle,
      badgeBg: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20',
      progressBar: 'bg-red-500 dark:bg-red-400',
      borderAccent: 'border-l-4 border-l-red-500 dark:border-l-red-400',
      glow: 'shadow-red-500/5 dark:shadow-red-950/20',
    },
    warning: {
      icon: AlertTriangle,
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20',
      progressBar: 'bg-amber-500 dark:bg-amber-400',
      borderAccent: 'border-l-4 border-l-amber-500 dark:border-l-amber-400',
      glow: 'shadow-amber-500/5 dark:shadow-amber-950/20',
    },
    info: {
      icon: Info,
      badgeBg: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border-sky-500/20',
      progressBar: 'bg-sky-500 dark:bg-sky-400',
      borderAccent: 'border-l-4 border-l-sky-500 dark:border-l-sky-400',
      glow: 'shadow-sky-500/5 dark:shadow-sky-950/20',
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        toast-container group relative flex flex-col w-full overflow-hidden rounded-xl
        bg-white/90 dark:bg-slate-900/90 backdrop-blur-md
        border border-slate-200/80 dark:border-slate-800/80
        ${config.borderAccent} ${config.glow}
        shadow-lg transition-all duration-200 pointer-events-auto
        ${isExiting ? 'toast-slide-out' : 'toast-slide-in'}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`p-2 rounded-lg border ${config.badgeBg} shrink-0`}>
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 pr-2 pt-0.5">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {title}
          </h4>
          {message && (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {message}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          type="button"
          aria-label="Close notification"
          className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar depleting over duration */}
      <div className="w-full bg-slate-100 dark:bg-slate-800/50 h-1 overflow-hidden">
        <div
          className={`h-full toast-progress ${config.progressBar}`}
          style={{
            animationDuration: `${duration}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      </div>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => {
        const filtered = prev.filter((t) => !t.isExiting);
        return [newToast, ...filtered].slice(0, 4);
      });
    },
    []
  );

  const success = useCallback(
    (title: string, message?: string, duration?: number) => showToast('success', title, message, duration),
    [showToast]
  );
  const error = useCallback(
    (title: string, message?: string, duration?: number) => showToast('error', title, message, duration),
    [showToast]
  );
  const warning = useCallback(
    (title: string, message?: string, duration?: number) => showToast('warning', title, message, duration),
    [showToast]
  );
  const info = useCallback(
    (title: string, message?: string, duration?: number) => showToast('info', title, message, duration),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast, success, error, warning, info }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full px-4 sm:px-0 pointer-events-none"
            aria-live="polite"
            aria-atomic="true"
          >
            {toasts.map((toast) => (
              <ToastCard key={toast.id} toast={toast} onClose={removeToast} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};
