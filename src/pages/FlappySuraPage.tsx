import { useEffect } from 'react';
import PlayPage from './PlayPage';

export default function FlappySuraPage() {
  useEffect(() => {
    document.title = 'Flappy Sura - Play Kadayadi Bird Game';
  }, []);

  // Redirects to play page with Sura character pre-selected
  return <PlayPage />;
}