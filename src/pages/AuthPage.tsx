import { useState, type FormEvent } from 'react';
import { Film, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { Route } from '@/lib/router';

interface AuthPageProps {
  navigate: (route: Route) => void;
}

export function AuthPage({ navigate }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error: err } = await fn(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    if (mode === 'signup') {
      setMode('signin');
      setError(null);
      setEmail('');
      setPassword('');
    }
    navigate({ name: 'home' });
  };

  return (
    <div className="fade-in flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="card p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-[#07070b] shadow-[0_0_24px_-6px_rgba(245,165,36,0.7)]">
              <Film className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {mode === 'signin'
                ? 'Sign in to view and manage your bookings.'
                : 'Sign up to start reserving movie tickets.'}
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input pl-10"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary mt-2">
              {submitting
                ? 'Please wait…'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === 'signin' ? (
              <>
                New to IMovies?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-semibold text-amber-400 hover:text-amber-300"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="font-semibold text-amber-400 hover:text-amber-300"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
