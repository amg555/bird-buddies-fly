import { useEffect } from 'react';
import { CharacterSelection } from '@/components/CharacterSelection';
import { HeaderMenu } from '@/components/HeaderMenu';
import { Character } from '@/types';
import { Link } from 'react-router-dom';

interface HomePageProps {
  onCharacterSelect: (character: Character) => void;
}

export default function HomePage({ onCharacterSelect }: HomePageProps) {
  useEffect(() => {
    document.title = 'Kadayadi Bird - Flappy Sura Game | Polayadi Mone | Suresh Gopi';
    
    // Update meta tags for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Play Kadayadi Bird - The ultimate Flappy Bird game featuring Suresh Gopi\'s Sura character with iconic Polayadi Mone dialogues. Free Malayalam movie character game!');
    }
  }, []);

  return (
    <div className="app-container">
      <HeaderMenu />
      <CharacterSelection onCharacterSelect={onCharacterSelect} />
      
      {/* Hidden SEO content for better indexing */}
      <div className="sr-only">
        <h1>Kadayadi Bird - Flappy Sura Game</h1>
        <p>Experience the ultimate Malayalam gaming sensation with Kadayadi Bird! Play as Suresh Gopi's iconic Sura character.</p>
        <nav>
          <Link to="/play">Start Playing</Link>
          <Link to="/characters">View Characters</Link>
          <Link to="/sura">Sura Character</Link>
          <Link to="/polayadi">Polayadi Mode</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </nav>
      </div>
    </div>
  );
}