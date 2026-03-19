// src/components/GameCanvas.tsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useGameRenderer } from '@/hooks/useGameRenderer';
import { useGameStore } from '@/hooks/useGameStore';
import { useDeviceConfig } from '@/hooks/useDeviceConfig';

interface GameCanvasProps {
  dimensions: { width: number; height: number };
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ dimensions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStore = useGameStore();
  const lastTouchTime = useRef(0);
  const touchStarted = useRef(false);
  
  // Use device configuration hook
  const deviceInfo = useDeviceConfig();
  
  const gameEngineResult = useGameEngine(canvasRef, deviceInfo.isMobile);
  const { 
    bird, 
    pipes, 
    powerUps, 
    particles, 
    jump, 
    difficulty, 
    combo, 
    calculateGapSize 
  } = gameEngineResult;

  const { imagesLoaded, loadingError } = useGameRenderer(
    canvasRef,
    bird,
    pipes,
    powerUps,
    particles,
    gameStore.selectedCharacter,
    gameStore.score,
    gameStore.highScore,
    gameStore.isPlaying,
    gameStore.isPaused,
    gameStore.isGameOver,
    combo,
    deviceInfo.deviceType,
    deviceInfo.config,
    calculateGapSize
  );

  // OPTIMIZED: Better input handling
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        event.preventDefault();
        jump();
      }
      if (event.code === 'KeyP' && gameStore.isPlaying && !gameStore.isGameOver) {
        gameStore.setPaused(!gameStore.isPaused);
      }
    };

    // OPTIMIZED: Better touch handling for mobile with prevention of ghost clicks
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
      
      // Prevent double-tap zoom on mobile
      const currentTime = Date.now();
      if (currentTime - lastTouchTime.current < 300) {
        return;
      }
      lastTouchTime.current = currentTime;
      touchStarted.current = true;
      
      // Small delay to ensure touch is registered properly
      requestAnimationFrame(() => {
        if (touchStarted.current) {
          jump();
          touchStarted.current = false;
        }
      });
    };
    
    const handleTouchEnd = (event: TouchEvent) => {
      event.preventDefault();
      touchStarted.current = false;
    };

    const handleMouseDown = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      const target = event.target as Node;
      if (canvas && (canvas === target || canvas.contains(target))) {
        event.preventDefault();
        // Only jump if not a touch device or touch hasn't been used
        if (!touchStarted.current) {
          jump();
        }
      }
    };

    // Add event listeners with proper options
    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('mousedown', handleMouseDown);
    
    // Use passive: false for immediate touch response
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
      canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousedown', handleMouseDown);
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [jump, gameStore]);

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      // Use device config for canvas dimensions
      const baseWidth = deviceInfo.config.canvasWidth;
      const baseHeight = deviceInfo.config.canvasHeight;
      const aspectRatio = baseWidth / baseHeight;

      let displayWidth: number;
      let displayHeight: number;

      // Calculate display size maintaining aspect ratio
      if (containerWidth / containerHeight > aspectRatio) {
        displayHeight = containerHeight;
        displayWidth = displayHeight * aspectRatio;
      } else {
        displayWidth = containerWidth;
        displayHeight = displayWidth / aspectRatio;
      }

      // Set canvas internal resolution
      canvas.width = baseWidth;
      canvas.height = baseHeight;

      // Set canvas display size
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '100%';
    };

    updateCanvasSize();
    
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateCanvasSize, 100);
    });
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [deviceInfo.config]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="canvas-wrapper"
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden'
      } as React.CSSProperties}
    >
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{ 
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
          // Fixed: Use proper TypeScript type for imageRendering
          imageRendering: deviceInfo.isMobile ? 'pixelated' : 'auto',
          transform: 'translateZ(0)',
          willChange: 'transform'
        } as React.CSSProperties}
      />
      
      {/* Game overlays */}
      {!gameStore.isPlaying && !gameStore.isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="canvas-overlay"
        >
          <div className="overlay-content">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 animate-bounce">Get Ready!</h2>
            <p className="mb-2 text-lg sm:text-xl">Playing as: {gameStore.selectedCharacter?.name}</p>
            <div className="space-y-1 text-xs sm:text-sm opacity-80">
              <p>🎮 Tap or press Space to jump</p>
              {!deviceInfo.isMobile && <p>⏸️ Press P to pause</p>}
              <p>🛡️ Collect power-ups!</p>
            </div>
          </div>
        </motion.div>
      )}

      {gameStore.isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="canvas-overlay"
        >
          <div className="overlay-content">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">⏸️ Paused</h2>
            <p className="text-xs sm:text-sm opacity-80">
              {deviceInfo.isMobile ? 'Tap pause button to resume' : 'Press P to resume'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Game indicators */}
      {gameStore.isPlaying && !gameStore.isPaused && difficulty > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold pointer-events-none shadow-lg"
        >
          🔥 x{difficulty.toFixed(1)}
        </motion.div>
      )}

      {gameStore.isPlaying && !gameStore.isPaused && combo > 5 && (
        <motion.div
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold pointer-events-none shadow-lg"
        >
          ⚡ x{combo}!
        </motion.div>
      )}
    </motion.div>
  );
};