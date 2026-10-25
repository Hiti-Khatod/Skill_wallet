import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Showtime, Theater } from '@/lib/types';

export interface ShowtimeWithTheater extends Showtime {
  theater: Theater;
}

export function useShowtimes(movieId: string | undefined) {
  const [showtimes, setShowtimes] = useState<ShowtimeWithTheater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setShowtimes([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    supabase
      .from('showtimes')
      .select('*, theater:theaters(*)')
      .eq('movie_id', movieId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) setError(err.message);
        else setShowtimes((data ?? []) as ShowtimeWithTheater[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [movieId]);

  return { showtimes, loading, error };
}
