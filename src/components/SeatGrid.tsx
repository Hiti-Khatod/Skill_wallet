import { useMemo } from 'react';

interface SeatGridProps {
  rowCount: number;
  seatsPerRow: number;
  reservedLabels: Set<string>;
  selectedLabels: Set<string>;
  onToggle: (label: string) => void;
}

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function SeatGrid({ rowCount, seatsPerRow, reservedLabels, selectedLabels, onToggle }: SeatGridProps) {
  const rows = useMemo(() => {
    return Array.from({ length: rowCount }, (_, r) => {
      const letter = ROW_LETTERS[r] ?? String.fromCharCode(65 + r);
      const seats = Array.from({ length: seatsPerRow }, (_, s) => `${letter}${s + 1}`);
      return { letter, seats };
    });
  }, [rowCount, seatsPerRow]);

  const aisleAfter = Math.floor(seatsPerRow / 2);

  return (
    <div className="card overflow-hidden p-6 sm:p-8">
      <div className="relative mx-auto mb-10 h-2 w-full max-w-3xl rounded-full bg-gradient-to-r from-amber-400/20 via-amber-400/60 to-amber-400/20 shadow-[0_0_24px_-4px_rgba(245,165,36,0.5)]">
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          Screen
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        {rows.map((row) => (
          <div key={row.letter} className="flex items-center gap-2">
            <span className="w-5 text-center text-xs font-semibold text-slate-600">{row.letter}</span>
            <div className="flex items-center gap-1.5">
              {row.seats.map((label, idx) => {
                const reserved = reservedLabels.has(label);
                const selected = selectedLabels.has(label);
                const isAisle = idx === aisleAfter;

                return (
                  <div key={label} className="flex items-center">
                    <button
                      disabled={reserved}
                      onClick={() => onToggle(label)}
                      title={`Seat ${label}${reserved ? ' — taken' : ''}`}
                      className={[
                        'h-8 w-8 rounded-md text-[10px] font-semibold transition-all duration-150 sm:h-9 sm:w-9',
                        reserved
                          ? 'cursor-not-allowed bg-white/5 text-slate-700'
                          : selected
                          ? 'bg-amber-400 text-[#07070b] shadow-[0_0_14px_-2px_rgba(245,165,36,0.8)] scale-110'
                          : 'bg-[#1d1d2b] text-slate-300 hover:bg-amber-400/20 hover:text-amber-200',
                      ].join(' ')}
                    >
                      {label.slice(1)}
                    </button>
                    {isAisle && <span className="mx-1.5 inline-block w-3" aria-hidden />}
                  </div>
                );
              })}
            </div>
            <span className="w-5 text-center text-xs font-semibold text-slate-600">{row.letter}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 border-t border-white/5 pt-6 text-xs text-slate-400">
        <Legend className="bg-[#1d1d2b]" label="Available" />
        <Legend className="bg-amber-400" label="Selected" />
        <Legend className="bg-white/5" label="Taken" muted />
      </div>
    </div>
  );
}

function Legend({ className, label, muted }: { className: string; label: string; muted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-4 w-4 rounded ${className} ${muted ? '' : 'border border-white/10'}`} />
      {label}
    </span>
  );
}
