import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Film, MapPin, Ticket } from 'lucide-react';
import { useShowtimeDetail, useReservedSeats } from '@/lib/useShowtimeDetail';
import { useRequireAuth } from '@/lib/router';
import { createBooking } from '@/lib/booking';
import { formatCurrency, formatShowtime } from '@/lib/format';
import { FullPageSpinner } from '@/components/Spinner';
import { SeatGrid } from '@/components/SeatGrid';
import { ToastViewport, useToasts } from '@/components/Toast';
import type { Route } from '@/lib/router';

interface SeatSelectionPageProps {
  showtimeId: string;
  navigate: (route: Route) => void;
}

export function SeatSelectionPage({ showtimeId, navigate }: SeatSelectionPageProps) {
  const { detail, loading, error } = useShowtimeDetail(showtimeId);
  const { reservedLabels } = useReservedSeats(showtimeId);
  const { ready } = useRequireAuth(navigate);
  const { toasts, push, dismiss } = useToasts();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const showtime = detail?.showtime;
  const theater = detail?.theater;
  const movie = detail?.movie;
  const { time, day, full } = useMemo(() => {
    if (!showtime) return { time: '', day: '', full: '' };
    return formatShowtime(showtime.start_time);
  }, [showtime]);

  const sortedSelected = useMemo(() => Array.from(selected).sort(), [selected]);
  const totalCents = showtime ? sortedSelected.length * showtime.price_cents : 0;

  const toggleSeat = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const onConfirm = async () => {
    if (!showtime || !ready) return;
    setSubmitting(true);
    const { bookingId, error: err } = await createBooking({
      showtimeId: showtime.id,
      seatLabels: sortedSelected,
      priceCentsPerSeat: showtime.price_cents,
    });
    setSubmitting(false);
    if (err || !bookingId) {
      push('error', err ?? 'Something went wrong. Please try again.');
      return;
    }
    push(
      'success',
      `Booked ${sortedSelected.length} ${sortedSelected.length === 1 ? 'seat' : 'seats'} for ${movie?.title ?? 'your movie'}.`
    );
    setSelected(new Set());
    setTimeout(() => navigate({ name: 'bookings' }), 700);
  };

  if (loading) return <FullPageSpinner label="Loading showtime…" />;

  if (error || !detail || !showtime || !theater || !movie) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Showtime unavailable</h1>
        <p className="mt-2 text-sm text-slate-400">
          {error ? error : 'This showtime may have been removed.'}
        </p>
        <button onClick={() => navigate({ name: 'home' })} className="btn-ghost mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismiss} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ name: 'movie', movieId: movie.id })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {movie.title}
        </button>

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#14141f] to-[#0c0c13] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border border-white/10 sm:block">
              {movie.poster_url && (
                <img src={movie.poster_url} alt={movie.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  {day}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  {time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  {theater.name}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-amber-400" />
                  {theater.screen_type}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            <span className="text-slate-500">Price</span>{' '}
            <span className="font-semibold text-amber-400">{formatCurrency(showtime.price_cents)}</span>
            <span className="text-slate-500"> / seat</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <SeatGrid
              rowCount={theater.row_count}
              seatsPerRow={theater.seats_per_row}
              reservedLabels={reservedLabels}
              selectedLabels={selected}
              onToggle={toggleSeat}
            />
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="card flex flex-col gap-4 p-6">
              <div>
                <h2 className="text-lg font-semibold">Order summary</h2>
                <p className="mt-0.5 text-xs text-slate-500">{full}</p>
              </div>

              <div className="flex flex-col gap-2 border-y border-white/5 py-4">
                {sortedSelected.length === 0 ? (
                  <p className="py-4 text-center text-sm text-slate-500">
                    Tap seats on the map to add them to your order.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {sortedSelected.map((label) => (
                      <span
                        key={label}
                        className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-200"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {sortedSelected.length} {sortedSelected.length === 1 ? 'seat' : 'seats'}
                </span>
                <span className="font-semibold text-white">{formatCurrency(totalCents)}</span>
              </div>

              <button
                onClick={onConfirm}
                disabled={submitting || sortedSelected.length === 0}
                className="btn-primary mt-2 w-full"
              >
                <Ticket className="h-4 w-4" />
                {submitting ? 'Reserving…' : 'Confirm Booking'}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>

              <p className="text-center text-[11px] text-slate-500">
                Seats update in real time. If someone grabs a seat first, we&apos;ll let you pick again.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
