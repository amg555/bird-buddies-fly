import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CharacterSelection } from '@/components/CharacterSelection';
import { Game } from '@/components/Game';
import { PaymentCallback } from '@/components/PaymentCallback';
import { HeaderMenu } from '@/components/HeaderMenu';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Character } from '@/types';
import { CHARACTERS } from '@/constants/characters';
import './styles/globals.css';

// Import all pages
import HomePage from '@/pages/HomePage';
import PlayPage from '@/pages/PlayPage';
import CharactersPage from '@/pages/CharactersPage';
import SuraPage from '@/pages/SuraPage';
import PolayadiPage from '@/pages/PolayadiPage';
import FlappySuraPage from '@/pages/FlappySuraPage';
import SureshGopiGamePage from '@/pages/SureshGopiGamePage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import AboutPage from '@/pages/AboutPage';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaymentCallback, setIsPaymentCallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set dynamic viewport height for mobile browsers
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      const vw = window.innerWidth * 0.01;
      document.documentElement.style.setProperty('--vw', `${vw}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    // Prevent zoom on iOS
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('id')) {
      setIsPaymentCallback(true);
    }
  }, [location]);

  useEffect(() => {
    const preloadAssets = async () => {
      setIsLoading(true);
      
      // Preload all character images
      const imagePromises = CHARACTERS.map(character => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = resolve;
          img.onerror = () => resolve(null); // Don't fail on missing images
          img.src = character.imagePath;
        });
      });

      // Preload critical sounds
      const soundPaths = [
        '/sounds/pass.mp3',
        '/sounds/pass-through.mp3',
        '/sounds/hit.mp3'
      ];

      const soundPromises = soundPaths.map(path => {
        return new Promise((resolve) => {
          const audio = new Audio(path);
          audio.addEventListener('canplaythrough', () => resolve(null), { once: true });
          audio.addEventListener('error', () => resolve(null), { once: true });
          audio.load();
        });
      });

      try {
        await Promise.all([...imagePromises, ...soundPromises]);
      } catch (error) {
        console.error('Asset preload error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadAssets();
  }, []);

  const handleCharacterSelect = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setGameStarted(true);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGameStarted(false);
    setSelectedCharacter(null);
  }, []);

  const handlePaymentComplete = useCallback(() => {
    setIsPaymentCallback(false);
    navigate(location.pathname);
  }, [navigate, location.pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isPaymentCallback) {
    return <PaymentCallback onComplete={handlePaymentComplete} />;
  }

  // For the main game routes, use the existing game logic
  if (location.pathname === '/' && !gameStarted) {
    return (
      <div className="app-container">
        <HeaderMenu />
        <CharacterSelection onCharacterSelect={handleCharacterSelect} />
      </div>
    );
  }

  if (location.pathname === '/' && gameStarted && selectedCharacter) {
    return (
      <div className="app-container">
        <HeaderMenu />
        <Game 
          key={`game-${selectedCharacter.id}`}
          selectedCharacter={selectedCharacter} 
          onBackToMenu={handleBackToMenu} 
        />
      </div>
    );
  }

  // For other routes, render the appropriate page
  return (
    <Routes>
      <Route path="/" element={<HomePage onCharacterSelect={handleCharacterSelect} />} />
      <Route path="/play" element={<PlayPage />} />
      <Route path="/characters" element={<CharactersPage />} />
      <Route path="/sura" element={<SuraPage />} />
      <Route path="/polayadi" element={<PolayadiPage />} />
      <Route path="/flappy-sura" element={<FlappySuraPage />} />
      <Route path="/suresh-gopi-game" element={<SureshGopiGamePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;