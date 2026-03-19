import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load the pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const PlayPage = lazy(() => import('./pages/PlayPage'));
const CharactersPage = lazy(() => import('./pages/CharactersPage'));
const SuraPage = lazy(() => import('./pages/SuraPage'));
const PolayadiPage = lazy(() => import('./pages/PolayadiPage'));
const FlappySuraPage = lazy(() => import('./pages/FlappySuraPage'));
const SureshGopiGamePage = lazy(() => import('./pages/SureshGopiGamePage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Lazy load payment components
const PayUSuccess = lazy(() => import('./components/PayUSuccess').then(module => ({ default: module.PayUSuccess })));
const PaymentCallback = lazy(() => import('./components/PaymentCallback').then(module => ({ default: module.PaymentCallback })));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="mt-4 text-white font-semibold">Loading...</p>
    </div>
  </div>
);

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/sura" element={<SuraPage />} />
          <Route path="/polayadi" element={<PolayadiPage />} />
          <Route path="/flappy-sura" element={<FlappySuraPage />} />
          <Route path="/suresh-gopi-game" element={<SureshGopiGamePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Payment Routes */}
          <Route path="/payment/success" element={<PayUSuccess />} />
          <Route path="/payment/failure" element={<PayUSuccess />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}