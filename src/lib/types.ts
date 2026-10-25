export interface Movie {
  id: string;
  title: string;
  synopsis: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  genre: string | null;
  duration_min: number | null;
  rating: string | null;
  imdb_score: number | null;
  director: string | null;
  cast_list: string[] | null;
  is_now_showing: boolean;
  created_at: string;
}

export interface Theater {
  id: string;
  name: string;
  screen_type: string;
  row_count: number;
  seats_per_row: number;
  created_at: string;
}

export interface Showtime {
  id: string;
  movie_id: string;
  theater_id: string;
  start_time: string;
  price_cents: number;
  created_at: string;
  theater?: Theater;
}

export interface ReservedSeat {
  id: string;
  booking_id: string;
  showtime_id: string;
  seat_label: string;
  created_at: string;
}
