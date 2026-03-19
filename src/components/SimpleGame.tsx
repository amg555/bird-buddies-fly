import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Character } from '@/types';
import { useAudioManager } from '@/hooks/useAudioManager';

interface SimpleGameProps {
  selectedCharacter: Character;
  onBackToMenu: () => void;
}

export const SimpleGame: React.FC<SimpleGameProps> = ({ selectedCharacter, onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('birdBuddiesHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('birdBuddiesMuted');
    return saved === 'true';
  });
  
  const audioManager = useAudioManager(selectedCharacter);
  const backgroundMusicStartedRef = useRef(false);
  
  const gameStateRef = useRef({
    birdY: 250,
    velocity: 0,
    pipes: [] as Array<{x: number, gap: number, passed: boolean}>,
    animationId: 0,
    pipeTimer: 0
  });

  useEffect(() => {
    if (isMuted) {
      audioManager.mute();
    } else {
      audioManager.unmute();
    }
  }, [isMuted, audioManager]);

  useEffect(() => {
    if (isPlaying && !backgroundMusicStartedRef.current && !isMuted) {
      audioManager.startBackgroundMusic();
      backgroundMusicStartedRef.current = true;
    }
    
    if (!isPlaying && backgroundMusicStartedRef.current) {
      audioManager.stopBackgroundMusic();
      backgroundMusicStartedRef.current = false;
    }
  }, [isPlaying, isMuted, audioManager]);

  const checkCollision = useCallback(() => {
    const state = gameStateRef.current;
    const birdBox = {
      x: 100,
      y: state.birdY,
      width: 40,
      height: 40
    };

    if (state.birdY + 40 >= 450 || state.birdY <= 0) {
      return true;
    }

    for (const pipe of state.pipes) {
      if (pipe.x < 140 && pipe.x + 60 > 100) {
        if (birdBox.y < pipe.gap || birdBox.y + birdBox.height > pipe.gap + 150) {
          return true;
        }
      }
    }

    return false;
  }, []);

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
    setIsPlaying(false);
    
    audioManager.stopBackgroundMusic();
    backgroundMusicStartedRef.current = false;
    audioManager.playGameOver();
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('birdBuddiesHighScore', score.toString());
    }
  }, [score, highScore, audioManager]);

  const resetGame = useCallback(() => {
    const state = gameStateRef.current;
    state.birdY = 250;
    state.velocity = 0;
    state.pipes = [];
    state.pipeTimer = 0;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(false);
    
    audioManager.stopBackgroundMusic();
    backgroundMusicStartedRef.current = false;
  }, [audioManager]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 800, 500);

    // Update bird physics
    if (isPlaying && !isGameOver) {
      state.velocity += 0.5;
      state.birdY += state.velocity;

      if (checkCollision()) {
        handleGameOver();
        return;
      }

      // Update pipes
      state.pipeTimer++;
      if (state.pipeTimer > 100) {
        state.pipes.push({
          x: 800,
          gap: 100 + Math.random() * 200,
          passed: false
        });
        state.pipeTimer = 0;
      }

      state.pipes = state.pipes.filter(pipe => {
        pipe.x -= 2;

        if (!pipe.passed && pipe.x + 60 < 100) {
          pipe.passed = true;
          setScore(s => s + 1);
          audioManager.playScore();
        }

        return pipe.x > -60;
      });
    }

    // Draw pipes
    ctx.fillStyle = '#228B22';
    state.pipes.forEach(pipe => {
      ctx.fillRect(pipe.x, 0, 60, pipe.gap);
      ctx.fillRect(pipe.x, pipe.gap + 150, 60, 500 - pipe.gap - 150);
    });

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 450, 800, 50);

    // Draw bird
    const birdImage = new Image();
    birdImage.src = selectedCharacter.imagePath;
    
    if (birdImage.complete && birdImage.naturalHeight !== 0) {
      ctx.drawImage(birdImage, 100, state.birdY, 40, 40);
    } else {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(100, state.birdY, 40, 40);
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(selectedCharacter.name[0], 120, state.birdY + 25);
    }

    // Draw UI
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 35);
    ctx.fillText(`Best: ${highScore}`, 20, 65);

    // Game state overlays
    if (!isPlaying && !isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 800, 500);
      ctx.fillStyle = 'white';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click to Start', 400, 250);
    }

    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 800, 500);
      ctx.fillStyle = 'white';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', 400, 200);
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${score}`, 400, 240);
      if (score === highScore && score > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.fillText('🏆 New High Score!', 400, 280);
      }
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText('Click to play again', 400, 320);
    }

    state.animationId = requestAnimationFrame(gameLoop);
  }, [selectedCharacter, score, highScore, isPlaying, isGameOver, checkCollision, handleGameOver, audioManager]);

  useEffect(() => {
    const state = gameStateRef.current;
    state.animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(state.animationId);
      audioManager.stopBackgroundMusic();
    };
  }, [gameLoop, audioManager]);

  const handleJump = useCallback(() => {
    const state = gameStateRef.current;
    
    if (isGameOver) {
      resetGame();
      return;
    }

    if (!isPlaying) {
      setIsPlaying(true);
      state.pipes = [];
      state.pipeTimer = 0;
      setScore(0);
    }

    state.velocity = -10;
    audioManager.playJump();
  }, [isPlaying, isGameOver, resetGame, audioManager]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleJump]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('birdBuddiesMuted', newMuted.toString());
    
    if (newMuted) {
      audioManager.stopBackgroundMusic();
      backgroundMusicStartedRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Simple Game Mode</h1>
          <div className="flex gap-2">
            <button
              onClick={toggleMute}
              className={`px-4 py-2 rounded transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </button>
            <button
              onClick={onBackToMenu}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onClick={handleJump}
          className="border-2 border-gray-300 cursor-pointer rounded"
          style={{ display: 'block', backgroundColor: '#87CEEB' }}
        />
        
        <div className="mt-4 text-center text-gray-600">
          <p>Playing as: {selectedCharacter.name}</p>
          <p className="text-sm">Click/Tap/Space to {isGameOver ? 'restart' : isPlaying ? 'jump' : 'start'}</p>
        </div>
      </div>
    </div>
  );
};