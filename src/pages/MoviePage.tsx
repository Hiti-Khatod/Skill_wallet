import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, Film, Star, Users } from 'lucide-react';
import { useMovie } from '@/lib/useMovies';
import { useShowtimes, type ShowtimeWithTheater } from '@/lib/useShowtimes';
import { useAuth } from '@/lib/auth';
import { formatCurrency, formatRuntime, formatShowtime } from '@/lib/format';
import { FullPageSpinner } from '@/components/Spinner';
import { StarRating } from '@/components/StarRating';
import type { Route } from '@/lib/router';

interface MoviePageProps {
  movieId: string;
  navigate: (route: Route) => void;
}

export function MoviePage({ movieId, navigate }: MoviePageProps) {
  const { movie, loading } = useMovie(movieId);
  const { showtimes, loading: showLoading } = useShowtimes(movieId);
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const byDay = new Map<string, ShowtimeWithTheater[]>();
    for (const s of showtimes) {
      const { day } = formatShowtime(s.start_time);
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day)!.push(s);
    }
    return Array.from(byDay.entries());
  }, [showtimes]);

  const activeDay = selectedDay ?? grouped[0]?.[0] ?? null;
  const activeShowtimes = grouped.find(([d]) => d === activeDay)?.[1] ?? [];

  if (loading) return <FullPageSpinner label="Loading movie…" />;

  if (!movie) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Movie not found</h1>
        <p className="mt-2 text-sm text-slate-400">It may have been removed.</p>
        <button onClick={() => navigate({ name: 'home' })} className="btn-ghost mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          {movie.backdrop_url ? (
            <img src={movie.backdrop_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#14141f] to-[#07070b]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/80 to-[#07070b]/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All movies
          </button>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-end">
            <div className="w-36 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl sm:w-44 lg:w-52">
              {movie.poster_url && (
                <img src={movie.poster_url} alt={movie.title} className="aspect-[2/3] w-full object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {movie.genre && <span className="chip">{movie.genre}</span>}
                {movie.rating && <span className="chip">{movie.rating}</span>}
                <span className="chip">
                  <StarRating score={movie.imdb_score ?? null} />
                </span>
              </div>
              <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-400" />
                  {formatRuntime(movie.duration_min)}
                </span>
                {movie.director && (
                  <span className="inline-flex items-center gap-1.5">
                    <Film className="h-4 w-4 text-amber-400" />
                    Dir. {movie.director}
                  </span>
                )}
              </div>
              {movie.synopsis && (
                <p className="max-w-2xl text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
                  {movie.synopsis}
                </p>
              )}
              {movie.cast_list && movie.cast_list.length > 0 && (
                <p className="text-xs text-slate-400">
                  <span className="text-slate-500">Cast:</span> {movie.cast_list.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Select a showtime</h2>
          {showtimes.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Users className="h-4 w-4 text-amber-400" />
              Real-time availability
            </div>
          )}
        </div>

        {showLoading ? (
          <FullPageSpinner label="Finding showtimes…" />
        ) : showtimes.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-sm text-slate-400">
              No upcoming showtimes for this film. Please check back later.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {grouped.map(([day, list]) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeDay === day
                      ? 'bg-amber-400 text-[#07070b]'
                      : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wider opacity-70">
                    {list.length} {list.length === 1 ? 'show' : 'shows'}
                  </span>
                  {day}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeShowtimes.map((s) => {
                const { time } = formatShowtime(s.start_time);
                return (
                  <button
                    key={s.id}
                    onClick={() =>
                      user
                        ? navigate({ name: 'seats', showtimeId: s.id })
                        : navigate({ name: 'auth' })
                    }
                    className="group card flex items-center justify-between gap-4 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-amber-400/40"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl font-bold text-amber-400">{time}</span>
                      <span className="text-sm text-slate-300">{s.theater.name}</span>
                      <span className="text-xs text-slate-500">
                        {s.theater.screen_type} · {formatCurrency(s.price_cents)} / seat
                      </span>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all group-hover:border-amber-400/50 group-hover:bg-amber-400 group-hover:text-[#07070b]">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>

            {!user && (
              <p className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                <Star className="h-4 w-4 text-amber-400" />
                You&apos;ll need to sign in to pick your seats.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
