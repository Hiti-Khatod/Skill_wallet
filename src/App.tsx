import { AuthProvider } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { MoviePage } from '@/pages/MoviePage';
import { SeatSelectionPage } from '@/pages/SeatSelectionPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { AuthPage } from '@/pages/AuthPage';

function App() {
  const { route, navigate } = useRouter();

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Header navigate={navigate} current={route.name} />
        <main className="flex-1">
          {route.name === 'home' && <HomePage navigate={navigate} />}
          {route.name === 'movie' && <MoviePage movieId={route.movieId} navigate={navigate} />}
          {route.name === 'seats' && (
            <SeatSelectionPage showtimeId={route.showtimeId} navigate={navigate} />
          )}
          {route.name === 'bookings' && <BookingsPage navigate={navigate} />}
          {route.name === 'auth' && <AuthPage navigate={navigate} />}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
