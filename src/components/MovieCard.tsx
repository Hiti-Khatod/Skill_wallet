import { Clock, Star } from 'lucide-react';
import type { Movie } from '@/lib/types';
import { formatRuntime } from '@/lib/format';
import { StarRating } from '@/components/StarRating';
import type { Route } from '@/lib/router';

interface MovieCardProps {
  movie: Movie;
  navigate: (route: Route) => void;
  index?: number;
}

export function MovieCard({ movie, navigate, index = 0 }: MovieCardProps) {
  return (
    <button
      onClick={() => navigate({ name: 'movie', movieId: movie.id })}
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
      className="group rise-in relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c13] text-left transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="skeleton h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c13] via-transparent to-transparent opacity-90" />
        {movie.rating && (
          <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200 backdrop-blur">
            {movie.rating}
          </span>
        )}
        <div className="absolute left-3 top-11 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 backdrop-blur">
          <StarRating score={movie.imdb_score ?? null} />
        </div>
        {!movie.is_now_showing && (
          <span className="absolute right-3 top-3 rounded-md bg-amber-400/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#07070b]">
            Coming Soon
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-white">{movie.title}</h3>
        {movie.genre && <p className="text-xs text-slate-400">{movie.genre}</p>}
        <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRuntime(movie.duration_min)}
          </span>
          {movie.is_now_showing ? (
            <span className="inline-flex items-center gap-1 text-amber-400">
              <Star className="h-3 w-3 fill-amber-400" strokeWidth={0} />
              Now Showing
            </span>
          ) : (
            <span>Coming Soon</span>
          )}
        </div>
      </div>
    </button>
  );
}
