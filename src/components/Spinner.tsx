import { Loader2 } from 'lucide-react';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
      <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner label={label} />
    </div>
  );
}
