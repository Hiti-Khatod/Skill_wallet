import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface BookingWithDetails {
  id: string;
  user_id: string;
  showtime_id: string;
  total_cents: number;
  status: string;
  created_at: string;
  showtime: {
    id: string;
    start_time: string;
    price_cents: number;
    theater: {
      id: string;
      name: string;
      screen_type: string;
    };
    movie: {
      id: string;
      title: string;
      poster_url: string | null;
    };
  };
  reserved_seats: { seat_label: string }[];
}

export function useBookings(userId: string | undefined) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);

    const load = () => {
      supabase
        .from('bookings')
        .select(
          '*, showtime:showtimes(id, start_time, price_cents, theater:theaters(id, name, screen_type), movie:movies(id, title, poster_url)), reserved_seats(seat_label)'
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data, error: err }) => {
          if (!active) return;
          if (err) setError(err.message);
          else setBookings((data ?? []) as BookingWithDetails[]);
          setLoading(false);
        });
    };

    load();

    const channel = supabase
      .channel(`bookings:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${userId}` },
        () => load()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { bookings, loading, error };
}
