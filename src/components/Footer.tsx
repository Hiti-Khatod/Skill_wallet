import { Film } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-[#07070b]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-[#07070b]">
              <Film className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-base font-bold">
              I<span className="text-amber-400">Movies</span>
            </span>
          </div>
          <p className="text-center text-xs text-slate-500 sm:text-right">
            Cinema tickets, real-time seat selection, and booking management.
            <br className="hidden sm:block" />
            Built for the love of the movies.
          </p>
        </div>
      </div>
    </footer>
  );
}
