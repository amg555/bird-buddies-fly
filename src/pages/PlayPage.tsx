import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Game } from '@/components/Game';
import { HeaderMenu } from '@/components/HeaderMenu';
import { CharacterSelection } from '@/components/CharacterSelection';
import { GameSettings } from '@/components/GameSettings';
import { Character } from '@/types';
import { CHARACTERS } from '@/constants/characters';

export default function PlayPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    document.title = 'Play Kadayadi Bird - Flappy Sura Game Now';
  }, []);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleBackToCharacterSelect = () => {
    setSelectedCharacter(null);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!selectedCharacter) {
    return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
  }

  return (
    <div className="app-container">
      <HeaderMenu />
      <Link 
        to="/" 
        className="absolute top-20 left-4 z-50 flex items-center gap-2 text-white bg-black/20 px-4 py-2 rounded-lg hover:bg-black/30 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Home</span>
      </Link>
      
      <GameSettings isMuted={isMuted} onToggleMute={handleToggleMute} />
      
      <Game 
        selectedCharacter={selectedCharacter} 
        onBackToMenu={handleBackToCharacterSelect}
        isMuted={isMuted}
      />
      
      <div className="sr-only">
        <h1>Play Kadayadi Bird - Flappy Sura Game</h1>
        <p>Jump into action with Polayadi Sura! Navigate through pipes and collect points with Suresh Gopi's famous dialogues.</p>
      </div>
    </div>
  );
}