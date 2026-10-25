export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatShowtime(iso: string): { time: string; day: string; full: string } {
  const date = new Date(iso);
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const full = `${day} · ${time}`;
  return { time, day, full };
}

export function formatBookingDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
