import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

export type Route =
  | { name: 'home' }
  | { name: 'movie'; movieId: string }
  | { name: 'seats'; showtimeId: string }
  | { name: 'bookings' }
  | { name: 'auth' };

export interface RouteState {
  route: Route;
  navigate: (route: Route) => void;
}

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'movie' && parts[1]) return { name: 'movie', movieId: parts[1] };
  if (parts[0] === 'seats' && parts[1]) return { name: 'seats', showtimeId: parts[1] };
  if (parts[0] === 'bookings') return { name: 'bookings' };
  if (parts[0] === 'auth') return { name: 'auth' };
  return { name: 'home' };
}

function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'movie':
      return `#/movie/${route.movieId}`;
    case 'seats':
      return `#/seats/${route.showtimeId}`;
    case 'bookings':
      return '#/bookings';
    case 'auth':
      return '#/auth';
  }
}

export function useRouter(): RouteState {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: Route) => {
    const hash = routeToHash(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      setRoute(next);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { route, navigate };
}

export function useRequireAuth(navigate: (r: Route) => void): { ready: boolean } {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ name: 'auth' });
    }
  }, [loading, session, navigate]);

  return { ready: !loading && !!session };
}
