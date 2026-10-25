import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, Trash2, Film } from 'lucide-react';
import { useBookings, type BookingWithDetails } from '@/lib/useBookings';
import { useAuth } from '@/lib/auth';
import { useRequireAuth } from '@/lib/router';
import { cancelBooking } from '@/lib/booking';
import { formatCurrency, formatShowtime, formatBookingDate } from '@/lib/format';
import { FullPageSpinner } from '@/components/Spinner';
import { ToastViewport, useToasts } from '@/components/Toast';
import type { Route } from '@/lib/router';

interface BookingsPageProps {
  navigate: (route: Route) => void;
}

export function BookingsPage({ navigate }: BookingsPageProps) {
  const { user } = useAuth();
  const { ready } = useRequireAuth(navigate);
  const { bookings, loading, error } = useBookings(user?.id);
  const { toasts, push, dismiss } = useToasts();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const onCancel = async (booking: BookingWithDetails) => {
    setCancellingId(booking.id);
    const { error: err } = await cancelBooking(booking.id);
    setCancellingId(null);
    if (err) {
      push('error', err);
      return;
    }
    push('success', 'Your booking was cancelled and the seats are available again.');
  };

  if (!ready) return <FullPageSpinner label="Checking your session…" />;
  if (loading) return <FullPageSpinner label="Loading your tickets…" />;

  const active = bookings.filter((b) => b.status === 'confirmed');
  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="fade-in mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <ToastViewport toasts={toasts} onDismiss={dismiss} />

      <button
        onClick={() => navigate({ name: 'home' })}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to movies
      </button>

      <header className="mb-10">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <Ticket className="h-7 w-7 text-amber-400" />
          My Tickets
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          All your reservations in one place. Cancel to release your seats.
        </p>
      </header>

      {error && (
        <div className="card mb-6 border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">{error}</div>
      )}

      {bookings.length === 0 ? (
        <EmptyState navigate={navigate} />
      ) : (
        <div className="flex flex-col gap-8">
          {active.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Active · {active.length}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {active.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    navigate={navigate}
                    onCancel={onCancel}
                    cancelling={cancellingId === b.id}
                  />
                ))}
              </div>
            </section>
          )}

          {cancelled.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Cancelled · {cancelled.length}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {cancelled.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    navigate={navigate}
                    onCancel={onCancel}
                    cancelling={cancellingId === b.id}
                    dimmed
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  navigate,
  onCancel,
  cancelling,
  dimmed,
}: {
  booking: BookingWithDetails;
  navigate: (r: Route) => void;
  onCancel: (b: BookingWithDetails) => void;
  cancelling: boolean;
  dimmed?: boolean;
}) {
  const { showtime } = booking;
  const { time, day } = formatShowtime(showtime.start_time);
  const seats = (booking.reserved_seats ?? []).map((s) => s.seat_label).sort();

  return (
    <article className={`card flex gap-4 p-4 transition-opacity ${dimmed ? 'opacity-60' : ''}`}>
      <button
        onClick={() => navigate({ name: 'movie', movieId: showtime.movie.id })}
        className="h-32 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 sm:h-36 sm:w-24"
        aria-label={`View ${showtime.movie.title}`}
      >
        {showtime.movie.poster_url ? (
          <img src={showtime.movie.poster_url} alt={showtime.movie.title} className="h-full w-full object-cover" />
        ) : (
          <div className="skeleton h-full w-full" />
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => navigate({ name: 'movie', movieId: showtime.movie.id })}
            className="text-left text-base font-semibold leading-tight hover:text-amber-300"
          >
            {showtime.movie.title}
          </button>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              booking.status === 'confirmed'
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-red-500/15 text-red-300'
            }`}
          >
            {booking.status}
          </span>
        </div>

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
            {showtime.theater.name}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {seats.map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-slate-200"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-white">{formatCurrency(booking.total_cents)}</span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">Booked {formatBookingDate(booking.created_at)}</span>
            {booking.status === 'confirmed' && (
              <button
                onClick={() => onCancel(booking)}
                disabled={cancelling}
                className="btn-danger !px-3 !py-1.5 !text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {cancelling ? 'Cancelling…' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div className="card flex flex-col items-center gap-4 p-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
        <Film className="h-7 w-7" />
      </span>
      <div>
        <h2 className="text-xl font-semibold">No tickets yet</h2>
        <p className="mt-1 text-sm text-slate-400">
          Browse what&apos;s showing and reserve your first seat.
        </p>
      </div>
      <button onClick={() => navigate({ name: 'home' })} className="btn-primary">
        Browse Movies
      </button>
    </div>
  );
}
