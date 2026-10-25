import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Movie } from '@/lib/types';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) setError(err.message);
        else setMovies(data ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { movies, loading, error };
}

export function useMovie(movieId: string | undefined) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setMovie(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    supabase
      .from('movies')
      .select('*')
      .eq('id', movieId)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) setError(err.message);
        else setMovie(data);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [movieId]);

  return { movie, loading, error };
}
