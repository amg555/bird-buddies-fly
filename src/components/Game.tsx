import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX, Home, Maximize2, Minimize2 } from 'lucide-react';
import { GameCanvas } from './GameCanvas';
import { GameOver } from './GameOver';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/hooks/useGameStore';
import { Character } from '@/types';

interface GameProps {
  selectedCharacter: Character;
  onBackToMenu: () => void;
}

export const Game: React.FC<GameProps> = ({ selectedCharacter, onBackToMenu }) => {
  const gameStore = useGameStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const hasInitialized = useRef(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Calculate responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (gameContainerRef.current) {
        const container = gameContainerRef.current;
        const rect = container.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (gameContainerRef.current) {
      resizeObserver.observe(gameContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  // Initialize game
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      gameStore.setSelectedCharacter(selectedCharacter);
      gameStore.resetGame();
    }
  }, []);

  const handleRestart = () => {
    gameStore.resetGame();
  };

  const togglePause = () => {
    if (gameStore.isPlaying && !gameStore.isGameOver) {
      gameStore.setPaused(!gameStore.isPaused);
    }
  };

  const toggleMute = () => {
    gameStore.setMuted(!gameStore.isMuted);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isMobile = window.innerWidth <= 768;

  return (
    <div 
      ref={gameContainerRef}
      className="game-wrapper"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="game-header"
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <img
            src={selectedCharacter.imagePath}
            alt={selectedCharacter.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/50 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-avatar')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-avatar w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg';
                fallback.textContent = selectedCharacter.name[0];
                parent.appendChild(fallback);
              }
            }}
          />
          <div className="text-white">
            <h2 className="font-bold text-sm sm:text-lg">{selectedCharacter.name}</h2>
            {!isMobile && (
              <p className="text-xs sm:text-sm opacity-80 hidden sm:block">{selectedCharacter.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
            title={gameStore.isMuted ? "Unmute" : "Mute"}
          >
            {gameStore.isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePause}
            className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
            disabled={!gameStore.isPlaying || gameStore.isGameOver}
            title={gameStore.isPaused ? "Resume" : "Pause"}
          >
            {gameStore.isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToMenu}
            className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
            title="Back to Menu"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </motion.header>

      {/* Game Area */}
      <div className="game-area">
        {gameStore.isGameOver ? (
          <GameOver onRestart={handleRestart} onBackToMenu={onBackToMenu} />
        ) : (
          <GameCanvas dimensions={dimensions} />
        )}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="game-footer"
      >
        <div className="flex justify-center items-center gap-4 text-sm sm:text-base">
          <span className="font-bold">Score: {gameStore.score}</span>
          <span className="text-white/60">•</span>
          <span className="font-bold">Best: {gameStore.highScore}</span>
          {!gameStore.isPlaying && !gameStore.isGameOver && (
            <>
              <span className="text-white/60">•</span>
              <span className="animate-pulse">Tap to start!</span>
            </>
          )}
        </div>
      </motion.footer>
    </div>
  );
};