import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ReservedSeat, Showtime, Theater, Movie } from '@/lib/types';

export interface ShowtimeDetail {
  showtime: Showtime;
  theater: Theater;
  movie: Movie;
}

export function useShowtimeDetail(showtimeId: string | undefined) {
  const [detail, setDetail] = useState<ShowtimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showtimeId) {
      setDetail(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    supabase
      .from('showtimes')
      .select('*, theater:theaters(*), movie:movies(*)')
      .eq('id', showtimeId)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        if (!data) {
          setDetail(null);
          setLoading(false);
          return;
        }
        const { theater, movie, ...showtime } = data as any;
        setDetail({ showtime, theater, movie });
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [showtimeId]);

  return { detail, loading, error };
}

export function useReservedSeats(showtimeId: string | undefined) {
  const [reserved, setReserved] = useState<ReservedSeat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!showtimeId) {
      setReserved([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);

    const load = () => {
      supabase
        .from('reserved_seats')
        .select('*')
        .eq('showtime_id', showtimeId)
        .then(({ data }) => {
          if (!active) return;
          setReserved(data ?? []);
          setLoading(false);
        });
    };

    load();

    const channel = supabase
      .channel(`reserved_seats:${showtimeId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reserved_seats', filter: `showtime_id=eq.${showtimeId}` },
        () => load()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [showtimeId]);

  const reservedLabels = new Set(reserved.map((r) => r.seat_label));
  return { reserved, reservedLabels, loading };
}
