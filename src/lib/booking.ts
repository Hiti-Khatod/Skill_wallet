import { supabase } from '@/lib/supabase';

export interface CreateBookingInput {
  showtimeId: string;
  seatLabels: string[];
  priceCentsPerSeat: number;
}

export async function createBooking({
  showtimeId,
  seatLabels,
  priceCentsPerSeat,
}: CreateBookingInput): Promise<{ bookingId: string | null; error: string | null }> {
  if (seatLabels.length === 0) {
    return { bookingId: null, error: 'Select at least one seat.' };
  }

  const { data: existing, error: checkErr } = await supabase
    .from('reserved_seats')
    .select('seat_label')
    .eq('showtime_id', showtimeId)
    .in('seat_label', seatLabels);

  if (checkErr) {
    return { bookingId: null, error: 'Could not verify seat availability. Please try again.' };
  }

  const taken = new Set((existing ?? []).map((r) => r.seat_label));
  const nowTaken = seatLabels.filter((s) => taken.has(s));

  if (nowTaken.length > 0) {
    return {
      bookingId: null,
      error: `Some seats were just taken (${nowTaken.join(', ')}). Please pick different seats.`,
    };
  }

  const { data: booking, error: bookingErr } = await supabase
    .from('bookings')
    .insert({
      showtime_id: showtimeId,
      total_cents: seatLabels.length * priceCentsPerSeat,
      status: 'confirmed',
    })
    .select('id')
    .maybeSingle();

  if (bookingErr || !booking) {
    return { bookingId: null, error: 'We could not create your booking. Please try again.' };
  }

  const rows = seatLabels.map((label) => ({
    booking_id: booking.id,
    showtime_id: showtimeId,
    seat_label: label,
  }));

  const { error: seatsErr } = await supabase.from('reserved_seats').insert(rows);

  if (seatsErr) {
    await supabase.from('bookings').delete().eq('id', booking.id);
    if (seatsErr.code === '23505') {
      return {
        bookingId: null,
        error: 'One or more seats were reserved in the last moment. Please pick different seats.',
      };
    }
    return { bookingId: null, error: 'We could not reserve your seats. Please try again.' };
  }

  return { bookingId: booking.id, error: null };
}

export async function cancelBooking(bookingId: string): Promise<{ error: string | null }> {
  const { error: seatsErr } = await supabase
    .from('reserved_seats')
    .delete()
    .eq('booking_id', bookingId);

  if (seatsErr) {
    return { error: 'Could not release the seats. Please try again.' };
  }

  const { error: bookingErr } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (bookingErr) {
    return { error: 'Could not cancel the booking. Please try again.' };
  }

  return { error: null };
}
