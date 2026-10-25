import { Film, LogOut, Ticket, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { Route } from '@/lib/router';

interface HeaderProps {
  navigate: (route: Route) => void;
  current: Route['name'];
}

export function Header({ navigate, current }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07070b]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="group flex items-center gap-2.5"
          aria-label="IMovies home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-[#07070b] shadow-[0_0_20px_-6px_rgba(245,165,36,0.7)] transition-transform group-hover:scale-105">
            <Film className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            I<span className="text-amber-400">Movies</span>
          </span>
        </button>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => navigate({ name: 'home' })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              current === 'home' || current === 'movie' || current === 'seats'
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            Now Showing
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate({ name: 'bookings' })}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  current === 'bookings'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Ticket className="h-4 w-4" />
                My Tickets
              </button>
              <div className="ml-1 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:flex">
                <UserRound className="h-4 w-4 text-amber-400" />
                <span className="max-w-[180px] truncate text-xs text-slate-300">{user.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button onClick={() => navigate({ name: 'auth' })} className="btn-primary">
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
