import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export type ToastKind = 'success' | 'error';

export interface ToastMessage {
  id: number;
  kind: ToastKind;
  text: string;
}

let counter = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const push = (kind: ToastKind, text: string) => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, kind, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, push, dismiss };
}

interface ToastViewportProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  const isSuccess = toast.kind === 'success';

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      } ${
        isSuccess
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
          : 'border-red-500/30 bg-red-500/10 text-red-100'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
      )}
      <p className="flex-1 text-sm">{toast.text}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-slate-400 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
