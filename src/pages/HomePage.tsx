import { ArrowRight, Clapperboard, Sparkles, Ticket } from 'lucide-react';
import { useMovies } from '@/lib/useMovies';
import { MovieCard } from '@/components/MovieCard';
import { Spinner } from '@/components/Spinner';
import type { Route } from '@/lib/router';

interface HomePageProps {
  navigate: (route: Route) => void;
}

export function HomePage({ navigate }: HomePageProps) {
  const { movies, loading } = useMovies();
  const nowShowing = movies.filter((m) => m.is_now_showing);
  const comingSoon = movies.filter((m) => !m.is_now_showing);
  const featured = nowShowing[0] ?? movies[0];

  return (
    <div className="fade-in">
      {featured && (
        <Hero
          navigate={navigate}
          movieId={featured.id}
          posterUrl={featured.poster_url}
          backdropUrl={featured.backdrop_url}
          title={featured.title}
          genre={featured.genre}
          synopsis={featured.synopsis}
          rating={featured.rating}
        />
      )}

      <section className="mx-auto max-w-7xl px-4 pb-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
              <Clapperboard className="h-6 w-6 text-amber-400" />
              Now Showing
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Pick a movie, choose a showtime, and reserve your seat — all in real time.
            </p>
          </div>
        </div>

        {loading ? (
          <Spinner label="Loading movies…" />
        ) : nowShowing.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            No movies are currently showing. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {nowShowing.map((m, i) => (
              <MovieCard key={m.id} movie={m} navigate={navigate} index={i} />
            ))}
          </div>
        )}
      </section>

      {comingSoon.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
                <Sparkles className="h-6 w-6 text-amber-400" />
                Coming Soon
              </h2>
              <p className="mt-1 text-sm text-slate-400">Films arriving at IMovies shortly.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {comingSoon.map((m, i) => (
              <MovieCard key={m.id} movie={m} navigate={navigate} index={i} />
            ))}
          </div>
        </section>
      )}

      <FeatureBand />
    </div>
  );
}

function Hero({
  navigate,
  movieId,
  posterUrl,
  backdropUrl,
  title,
  genre,
  synopsis,
  rating,
}: {
  navigate: (route: Route) => void;
  movieId: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  title: string;
  genre: string | null;
  synopsis: string | null;
  rating: string | null;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0">
        {backdropUrl ? (
          <img src={backdropUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#14141f] to-[#07070b]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/85 to-[#07070b]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070b] via-[#07070b]/60 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:flex-row lg:items-end lg:gap-12 lg:px-8 lg:pb-28 lg:pt-32">
        <div className="rise-in w-40 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl sm:w-48 lg:w-56">
          {posterUrl && <img src={posterUrl} alt={title} className="aspect-[2/3] w-full object-cover" />}
        </div>
        <div className="rise-in flex flex-1 flex-col gap-5" style={{ animationDelay: '120ms' }}>
          <span className="chip border-amber-400/30 bg-amber-400/10 text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            Featured this week
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            {genre && <span className="chip">{genre}</span>}
            {rating && <span className="chip">{rating}</span>}
          </div>
          {synopsis && (
            <p className="max-w-2xl text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
              {synopsis}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={() => navigate({ name: 'movie', movieId })} className="btn-primary">
              <Ticket className="h-4 w-4" />
              Book Tickets
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate({ name: 'movie', movieId })} className="btn-ghost">
              View Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBand() {
  const features = [
    {
      icon: Clapperboard,
      title: 'Curated lineup',
      text: 'A rotating selection of new releases and beloved classics across every genre.',
    },
    {
      icon: Ticket,
      title: 'Real-time seats',
      text: 'See exactly which seats are free the moment someone releases them — no double bookings.',
    },
    {
      icon: Sparkles,
      title: 'Your ticket history',
      text: 'Every booking saved to your account. Review, cancel, and rebook in a couple of taps.',
    },
  ];

  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card flex flex-col gap-3 p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="text-base font-semibold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
