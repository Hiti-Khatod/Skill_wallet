import { Star } from 'lucide-react';

export function StarRating({ score }: { score: number | null }) {
  if (score == null) return null;
  return (
    <span className="inline-flex items-center gap-1 text-amber-400">
      <Star className="h-3.5 w-3.5 fill-amber-400" strokeWidth={0} />
      <span className="text-xs font-semibold text-amber-300">{score.toFixed(1)}</span>
    </span>
  );
}
