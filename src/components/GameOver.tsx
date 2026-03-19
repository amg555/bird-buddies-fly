// src/components/GameOver.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/hooks/useGameStore';
import { RotateCcw, Home, Volume2, Trophy, Upload } from 'lucide-react';
import { gameDataService } from '@/services/gameData.service';

interface GameOverProps {
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ onRestart, onBackToMenu }) => {
  const gameStore = useGameStore();
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const isNewHighScore = gameStore.score === gameStore.highScore && gameStore.score > 0;

  useEffect(() => {
    if (gameStore.selectedCharacter) {
      console.log(`Game Over Screen - Character: ${gameStore.selectedCharacter.name}`);
      console.log(`Voice file that should be playing: ${gameStore.selectedCharacter.soundFile}`);
    }
  }, [gameStore.selectedCharacter]);

  // Save score to Firebase
  useEffect(() => {
    const saveGameData = async () => {
      if (gameStore.score > 0 && gameStore.selectedCharacter && !scoreSaved) {
        setIsSavingScore(true);
        
        try {
          // Save game session
          await gameDataService.saveGameSession({
            character: gameStore.selectedCharacter.name,
            score: gameStore.score,
            startTime: new Date(Date.now() - 60000).toISOString(), // Approximate
            endTime: new Date().toISOString(),
            duration: 60, // Approximate duration in seconds
            deviceInfo: navigator.userAgent
          });

          // Update global stats
          await gameDataService.updateGlobalStats(
            gameStore.score, 
            gameStore.selectedCharacter.name
          );

          // Save to leaderboard if high score
          if (gameStore.score >= 10) { // Minimum score for leaderboard
            await gameDataService.saveToLeaderboard({
              playerName: gameStore.selectedCharacter.name,
              character: gameStore.selectedCharacter.name,
              score: gameStore.score,
              timestamp: null,
              deviceId: localStorage.getItem('deviceId') || undefined
            });
          }

          setScoreSaved(true);
          console.log('Score saved to Firebase');
        } catch (error) {
          console.error('Failed to save score:', error);
        } finally {
          setIsSavingScore(false);
        }
      }
    };

    saveGameData();
  }, [gameStore.score, gameStore.selectedCharacter, scoreSaved]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/95 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-xs sm:max-w-md mx-4"
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-800"
      >
        Game Over!
      </motion.h2>

      {gameStore.selectedCharacter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4"
        >
          <div className="flex justify-center mb-2">
            <img
              src={gameStore.selectedCharacter.imagePath}
              alt={gameStore.selectedCharacter.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-blue-400 shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg';
                  fallback.textContent = gameStore.selectedCharacter!.name[0];
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {gameStore.selectedCharacter.name}
          </p>
          <p className="text-sm text-gray-600 italic mb-2">
            "{gameStore.selectedCharacter.description}"
          </p>
          
          {/* Audio indicator */}
          {!gameStore.isMuted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
            >
              <Volume2 className="w-3 h-3 animate-pulse" />
              <span>Playing character voice...</span>
            </motion.div>
          )}
        </motion.div>
      )}

      {isNewHighScore && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-4"
        >
          <span className="text-2xl">🏆</span>
          <p className="text-lg sm:text-xl font-bold text-yellow-500">New High Score!</p>
        </motion.div>
      )}

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-lg sm:text-xl">
          <span className="text-gray-600">Score:</span>
          <span className="font-bold text-gray-800">{gameStore.score}</span>
        </div>
        <div className="flex justify-between text-lg sm:text-xl">
          <span className="text-gray-600">Best:</span>
          <span className="font-bold text-gray-800">{gameStore.highScore}</span>
        </div>
        
        {/* Firebase save status */}
        {isSavingScore && (
          <div className="text-center text-sm text-blue-600 mt-2 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4 animate-pulse" />
            Saving score...
          </div>
        )}
        
        {scoreSaved && (
          <div className="text-center text-sm text-green-600 mt-2 flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            Score saved to leaderboard!
          </div>
        )}
        
        {/* Achievement milestones */}
        {gameStore.score >= 100 && (
          <div className="text-center text-sm text-green-600 font-semibold mt-2">
            🌟 Legendary Score! 🌟
          </div>
        )}
        {gameStore.score >= 50 && gameStore.score < 100 && (
          <div className="text-center text-sm text-blue-600 font-semibold mt-2">
            ⭐ Amazing Score! ⭐
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2"
          variant="primary"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Button
          onClick={onBackToMenu}
          className="flex-1 flex items-center justify-center gap-2"
          variant="secondary"
        >
          <Home className="w-4 h-4" />
          Menu
        </Button>
      </div>
    </motion.div>
  );
};