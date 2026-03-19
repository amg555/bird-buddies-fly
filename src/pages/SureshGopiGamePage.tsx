import { useEffect } from 'react';
import PlayPage from './PlayPage';

export default function SureshGopiGamePage() {
  useEffect(() => {
    document.title = 'Suresh Gopi Game - Kadayadi Bird';
  }, []);

  // Redirects to play page with focus on Suresh Gopi character
  return <PlayPage />;
}