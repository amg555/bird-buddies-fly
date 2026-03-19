// src/hooks/useGameEngine.ts
import { useCallback, useRef, useEffect } from 'react';
import { Bird, Pipe, PowerUp, Particle } from '@/types';
import { 
  DIFFICULTY_CONFIG, 
  POWERUP_CONFIG,
  DeviceGameConfig 
} from '@/constants/gameConfig';
import { useGameStore } from './useGameStore';
import { useAudioManager } from './useAudioManager';
import { useDeviceConfig } from './useDeviceConfig';

// Define the return type for the hook
interface GameEngineReturn {
  bird: Bird;
  pipes: Pipe[];
  powerUps: PowerUp[];
  particles: Particle[];
  jump: () => void;
  resetGame: () => void;
  audioManager: ReturnType<typeof useAudioManager>;
  difficulty: number;
  combo: number;
  handleGameOver: (reason?: string) => void;
  calculateGapSize: (score: number) => number;
}

export const useGameEngine = (
  canvasRef: React.RefObject<HTMLCanvasElement>, 
  isMobile: boolean = false
): GameEngineReturn => {
  const gameStore = useGameStore();
  const audioManager = useAudioManager(gameStore.selectedCharacter || undefined);
  const deviceInfo = useDeviceConfig();
  
  // Use device-specific configuration
  const config = deviceInfo.config;
  const physics = deviceInfo.config.physics;
  
  // Add a ref to store the current config
  const currentConfigRef = useRef(config);
  
  // Frame timing for consistent physics
  const lastFrameTimeRef = useRef(0);
  const deltaTimeRef = useRef(0);
  const TARGET_FPS = deviceInfo.isMobile ? 30 : 60;
  const FRAME_TIME = 1000 / TARGET_FPS;
  
  // Pipe management constants
  const PIPE_SPACING = deviceInfo.isMobile ? 280 : 320; // Increased spacing
  const MIN_PIPES_ON_SCREEN = 3;
  const INITIAL_PIPE_OFFSET = 400; // Start pipes further away
  
  // Game state flags
  const gameStartedRef = useRef(false);
  const collisionEnabledRef = useRef(false);
  const resetInProgressRef = useRef(false); // Add this to prevent multiple resets
  
  // Cache for gap calculation
  const gapSizeCache = useRef<Map<number, number>>(new Map());
  
  // Update when config changes
  useEffect(() => {
    if (currentConfigRef.current !== config) {
      console.log('🔄 Config changed:', {
        device: deviceInfo.deviceType,
        pipeSpeed: config.pipeSpeed,
        pipeGap: config.pipeGap,
        gravity: config.physics.gravity,
        jumpStrength: config.physics.jumpStrength
      });
      currentConfigRef.current = config;
      gapSizeCache.current.clear();
    }
  }, [config, deviceInfo.deviceType]);
  
  // Helper function to get safe initial bird position
  const getSafeInitialBirdPosition = useCallback(() => {
    const canvas = canvasRef.current;
    const currentConfig = currentConfigRef.current;
    
    // Calculate safe Y position (1/3 from top or 200px, whichever is smaller)
    let safeY = Math.min(currentConfig.canvasHeight / 3, 200);
    
    // If canvas exists, use its actual height for more accurate positioning
    if (canvas) {
      safeY = Math.min(canvas.height / 3, 200);
      // Ensure bird isn't too close to top
      safeY = Math.max(safeY, 50);
    }
    
    return {
      x: currentConfig.birdX,
      y: safeY
    };
  }, [canvasRef]);
  
  // Calculate dynamic gap size based on score
  const calculateGapSize = useCallback((currentScore: number): number => {
    const roundedScore = Math.floor(currentScore / 10) * 10;
    
    if (gapSizeCache.current.has(roundedScore)) {
      return gapSizeCache.current.get(roundedScore)!;
    }
    
    const baseGap = config.pipeGap;
    
    // Gentler difficulty progression
    const difficultyLevel = Math.floor(currentScore / DIFFICULTY_CONFIG.scoreInterval);
    const gapReduction = Math.min(
      difficultyLevel * DIFFICULTY_CONFIG.gapDecrement,
      baseGap * 0.3 // Max 30% reduction
    );
    
    const calculatedGap = baseGap - gapReduction;
    const minimumGap = deviceInfo.isMobile 
      ? DIFFICULTY_CONFIG.minGapMobile 
      : DIFFICULTY_CONFIG.minGapDesktop;
    
    const finalGap = Math.max(calculatedGap, minimumGap);
    const rounded = Math.round(finalGap);
    
    gapSizeCache.current.set(roundedScore, rounded);
    return rounded;
  }, [config.pipeGap, deviceInfo.isMobile]);
  
  // Initialize bird with device-specific configuration
  const initializeBird = useCallback(() => {
    const position = getSafeInitialBirdPosition();
    const currentConfig = currentConfigRef.current;
    const currentPhysics = currentConfig.physics;
    
    return {
      x: position.x,
      y: position.y,
      width: currentConfig.birdSize * currentConfig.birdScale,
      height: currentConfig.birdSize * currentConfig.birdScale,
      velocity: 0,
      gravity: currentPhysics.gravity,
      jumpStrength: currentPhysics.jumpStrength,
      rotation: 0,
      invulnerable: false,
      powerUpActive: null,
      powerUpEndTime: 0
    };
  }, [getSafeInitialBirdPosition]);

  const birdRef = useRef<Bird>(initializeBird());
  const pipesRef = useRef<Pipe[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const lastPipeTimeRef = useRef(0);
  const lastPowerUpTimeRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const difficultyRef = useRef(1);
  const comboRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const backgroundMusicStartedRef = useRef(false);
  const gameOverProcessedRef = useRef(false);

  // Update difficulty based on score
  useEffect(() => {
    const difficultyLevel = Math.floor(gameStore.score / DIFFICULTY_CONFIG.scoreInterval);
    const newDifficulty = Math.min(
      1 + difficultyLevel * 0.1, // Gentler progression
      config.maxDifficulty
    );
    difficultyRef.current = newDifficulty;
  }, [gameStore.score, config.maxDifficulty]);

  // Handle background music
  useEffect(() => {
    if (gameStore.isPlaying && !backgroundMusicStartedRef.current && !gameStore.isMuted) {
      audioManager.startBackgroundMusic();
      backgroundMusicStartedRef.current = true;
    }
    
    if (!gameStore.isPlaying && backgroundMusicStartedRef.current) {
      audioManager.stopBackgroundMusic();
      backgroundMusicStartedRef.current = false;
    }
  }, [gameStore.isPlaying, gameStore.isMuted, audioManager]);

  const createParticles = useCallback((x: number, y: number, color: string) => {
    const particleCount = deviceInfo.isMobile ? 5 : 12;
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: deviceInfo.isMobile ? 20 : 30,
        color
      });
    }
    
    const maxParticles = deviceInfo.isMobile ? 20 : 50;
    particlesRef.current = [...particlesRef.current, ...newParticles].slice(-maxParticles);
  }, [deviceInfo.isMobile]);

  const createPowerUp = useCallback((): PowerUp => {
    const canvas = canvasRef.current;
    if (!canvas) return { 
      x: 0, 
      y: 0, 
      type: 'shield', 
      id: '', 
      collected: false 
    };
    
    const types: PowerUp['type'][] = ['shield', 'slowTime', 'doublePoints', 'magnet'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const yPadding = deviceInfo.isMobile ? 100 : 80;
    
    return {
      x: canvas.width + 100,
      y: yPadding + Math.random() * (canvas.height - yPadding * 2),
      type,
      id: `powerup-${Date.now()}-${Math.random()}`,
      collected: false
    };
  }, [canvasRef, deviceInfo.isMobile]);

  const createPipe = useCallback((xPosition?: number): Pipe => {
    const canvas = canvasRef.current;
    if (!canvas) return { 
      x: 0, 
      topHeight: 0, 
      passed: false, 
      id: '', 
      hasBonus: false 
    };
    
    const x = xPosition !== undefined ? xPosition : canvas.width + 100;
    const gapSize = calculateGapSize(gameStore.score);
    
    const groundHeight = config.groundHeight;
    const availableHeight = canvas.height - groundHeight;
    const minPipeHeight = deviceInfo.isMobile ? 60 : 80;
    const maxPipeHeight = availableHeight - gapSize - minPipeHeight;
    
    if (maxPipeHeight < minPipeHeight) {
      console.warn('Canvas too small for pipes');
      return {
        x,
        topHeight: Math.floor(availableHeight * 0.3),
        passed: false,
        id: `pipe-${Date.now()}-${Math.random()}`,
        hasBonus: false
      };
    }
    
    // Better pipe height distribution
    const centerBias = 0.7; // Bias towards center
    const random = Math.random();
    const biasedRandom = Math.pow(random, centerBias);
    
    const topHeight = Math.floor(
      minPipeHeight + biasedRandom * (maxPipeHeight - minPipeHeight)
    );
    
    const bonusChance = Math.min(0.05 + (gameStore.score / 2000), 0.2);
    const hasBonus = Math.random() < bonusChance;
    
    return {
      x,
      topHeight: Math.round(topHeight),
      passed: false,
      id: `pipe-${Date.now()}-${Math.random()}`,
      hasBonus
    };
  }, [canvasRef, gameStore.score, calculateGapSize, deviceInfo.isMobile, config.groundHeight]);

  // Initialize pipes with proper spacing
  const initializePipes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    pipesRef.current = [];
    
    // Create initial pipes with increased initial offset
    for (let i = 0; i < MIN_PIPES_ON_SCREEN; i++) {
      const x = canvas.width + INITIAL_PIPE_OFFSET + (i * PIPE_SPACING);
      pipesRef.current.push(createPipe(x));
    }
    
    console.log('Pipes initialized:', pipesRef.current.length, 'pipes with spacing:', PIPE_SPACING);
  }, [createPipe, PIPE_SPACING, MIN_PIPES_ON_SCREEN, INITIAL_PIPE_OFFSET]);

  const checkCollision = useCallback((bird: Bird, pipes: Pipe[]): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    // Don't check collision if game just started or reset is in progress
    if (!collisionEnabledRef.current || resetInProgressRef.current) return false;
    if (bird.invulnerable) return false;

    // Ground and ceiling collision with small buffer
    const groundBuffer = 5;
    const ceilingBuffer = 5;
    
    if (bird.y + bird.height >= canvas.height - config.groundHeight + groundBuffer || 
        bird.y <= -ceilingBuffer) {
      return true;
    }

    // More forgiving collision padding
    const collisionPadding = bird.powerUpActive === 'shield' 
      ? 20 
      : (deviceInfo.isMobile ? 15 : 10);
    
    const birdLeft = bird.x + collisionPadding;
    const birdRight = bird.x + bird.width - collisionPadding;
    const birdTop = bird.y + collisionPadding;
    const birdBottom = bird.y + bird.height - collisionPadding;
    
    for (const pipe of pipes) {
      // Skip distant pipes
      if (pipe.x > birdRight + 50 || pipe.x + config.pipeWidth < birdLeft - 50) {
        continue;
      }
      
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + config.pipeWidth;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        const gapSize = calculateGapSize(gameStore.score);
        const pipeBottomStart = pipe.topHeight + gapSize;
        
        if (birdTop < pipe.topHeight || birdBottom > pipeBottomStart) {
          return true;
        }
      }
    }
    
    return false;
  }, [canvasRef, calculateGapSize, deviceInfo.isMobile, gameStore.score, config]);

  const checkPowerUpCollection = useCallback(() => {
    const bird = birdRef.current;
    const birdCenterX = bird.x + bird.width/2;
    const birdCenterY = bird.y + bird.height/2;
    
    powerUpsRef.current = powerUpsRef.current.filter(powerUp => {
      if (powerUp.collected) return false;
      
      const dx = birdCenterX - powerUp.x;
      const dy = birdCenterY - powerUp.y;
      const distanceSquared = dx * dx + dy * dy;
      
      const baseRadius = deviceInfo.isMobile ? 45 : 35;
      const collectRadius = bird.powerUpActive === 'magnet' 
        ? config.powerUp.magnetRange
        : baseRadius;
      const radiusSquared = collectRadius * collectRadius;
      
      if (distanceSquared < radiusSquared) {
        powerUp.collected = true;
        activatePowerUp(powerUp.type);
        createParticles(powerUp.x, powerUp.y, '#00ff00');
        return false;
      }
      
      return powerUp.x > -50;
    });
  }, [deviceInfo.isMobile, createParticles, config.powerUp.magnetRange]);

  const activatePowerUp = useCallback((type: PowerUp['type']) => {
    const bird = birdRef.current;
    const duration = config.powerUp.duration;
    
    bird.powerUpActive = type;
    bird.powerUpEndTime = Date.now() + duration;
    
    if (type === 'shield') {
      bird.invulnerable = true;
    }
    
    audioManager.playCharacterScore();
  }, [audioManager, config.powerUp.duration]);

  const updateBird = useCallback((deltaTime: number) => {
    const bird = birdRef.current;
    const canvas = canvasRef.current;
    const currentPhysics = currentConfigRef.current.physics;
    
    // Cap delta time to prevent huge jumps
    const normalizedDelta = Math.min(deltaTime / FRAME_TIME, 1.5);
    
    // Apply gravity
    bird.velocity += currentPhysics.gravity * normalizedDelta;
    bird.velocity = Math.min(bird.velocity, currentPhysics.maxVelocity);
    
    // Update position
    bird.y += bird.velocity * normalizedDelta;
    
    // Clamp bird position to prevent going off-screen
    if (canvas) {
      // Prevent bird from going too high
      if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = Math.max(bird.velocity, 0);
      }
      
      // Prevent bird from going below ground
      const maxY = canvas.height - currentConfigRef.current.groundHeight - bird.height;
      if (bird.y > maxY) {
        bird.y = maxY;
        bird.velocity = 0;
      }
    }
    
    // Power-up management
    if (bird.powerUpActive && Date.now() > bird.powerUpEndTime) {
      bird.powerUpActive = null;
      bird.invulnerable = false;
    }
    
    // Smooth rotation
    const targetRotation = Math.min(
      Math.max(bird.velocity * currentPhysics.rotationSpeed, -0.5),
      0.5
    );
    bird.rotation += (targetRotation - bird.rotation) * 0.1;
  }, [FRAME_TIME, canvasRef]);

  // Updated pipe management
  const updatePipes = useCallback((deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const currentTime = Date.now();
    const normalizedDelta = Math.min(deltaTime / FRAME_TIME, 1.5);
    const currentConfig = currentConfigRef.current;
    
    // Speed modifiers
    const speedMultiplier = birdRef.current.powerUpActive === 'slowTime' ? 0.5 : 1;
    const difficultySpeedBonus = Math.min(
      (difficultyRef.current - 1) * currentConfig.difficultyProgression, 
      1
    );
    
    const basePipeSpeed = currentConfig.pipeSpeed;
    const pipeSpeed = (basePipeSpeed + difficultySpeedBonus) * speedMultiplier * normalizedDelta;
    
    // Generate new pipes based on rightmost pipe
    if (pipesRef.current.length > 0) {
      const rightmostPipe = Math.max(...pipesRef.current.map(p => p.x));
      
      if (rightmostPipe < canvas.width + PIPE_SPACING) {
        const newX = rightmostPipe + PIPE_SPACING;
        pipesRef.current.push(createPipe(newX));
      }
    } else {
      initializePipes();
    }
    
    // Ensure minimum pipes
    while (pipesRef.current.length < MIN_PIPES_ON_SCREEN) {
      const lastPipeX = pipesRef.current.length > 0 
        ? Math.max(...pipesRef.current.map(p => p.x))
        : canvas.width + INITIAL_PIPE_OFFSET;
      
      const newX = lastPipeX + PIPE_SPACING;
      pipesRef.current.push(createPipe(newX));
    }

    // Power-up spawning
    const powerUpInterval = deviceInfo.isMobile ? 12000 : 10000;
    if (currentTime - lastPowerUpTimeRef.current > powerUpInterval && 
        Math.random() < currentConfig.powerUp.spawnChance) {
      powerUpsRef.current.push(createPowerUp());
      lastPowerUpTimeRef.current = currentTime;
    }

    // Update pipes and check scoring
    const bird = birdRef.current;
    const updatedPipes: Pipe[] = [];
    
    for (const pipe of pipesRef.current) {
      pipe.x -= pipeSpeed;
      
      if (!pipe.passed && pipe.x + currentConfig.pipeWidth < bird.x) {
        pipe.passed = true;
        
        let points = 1;
        if (pipe.hasBonus) points += 1;
        if (bird.powerUpActive === 'doublePoints') points *= 2;
        
        comboRef.current++;
        if (comboRef.current > 5) {
          points += Math.floor(comboRef.current / 5);
        }
        
        points = Math.round(points * currentConfig.scoreMultiplier);
        
        for (let i = 0; i < points; i++) {
          gameStore.incrementScore();
        }
        
        audioManager.playScore();
        
        if (pipe.x > -100 && pipe.x < canvas.width + 100) {
          createParticles(pipe.x, canvas.height / 2, pipe.hasBonus ? 'gold' : 'white');
        }
      }
      
      if (pipe.x > -100) {
        updatedPipes.push(pipe);
      }
    }
    
    pipesRef.current = updatedPipes;

    // Update power-ups
    const updatedPowerUps: PowerUp[] = [];
    const floatOffset = Math.sin(Date.now() * 0.003) * 2;
    
    for (const powerUp of powerUpsRef.current) {
      powerUp.x -= pipeSpeed;
      powerUp.y += floatOffset;
      
      if (powerUp.x > -50) {
        updatedPowerUps.push(powerUp);
      }
    }
    
    powerUpsRef.current = updatedPowerUps;

    // Update particles
    if (particlesRef.current.length > 0) {
      const updatedParticles: Particle[] = [];
      
      for (const particle of particlesRef.current) {
        particle.x += particle.vx * normalizedDelta;
        particle.y += particle.vy * normalizedDelta;
        particle.vy += 0.2 * normalizedDelta;
        particle.life--;
        
        if (particle.life > 0) {
          updatedParticles.push(particle);
        }
      }
      
      particlesRef.current = updatedParticles;
    }
  }, [createPipe, createPowerUp, gameStore, audioManager, canvasRef, deviceInfo.isMobile, createParticles, FRAME_TIME, PIPE_SPACING, INITIAL_PIPE_OFFSET, MIN_PIPES_ON_SCREEN, initializePipes]);

  const jump = useCallback(() => {
    if (!gameStore.isGameOver && !resetInProgressRef.current) {
      if (!gameStore.isPlaying) {
        gameStore.setPlaying(true);
        gameStartedRef.current = true;
        
        // Enable collision after a short delay to prevent instant game over
        setTimeout(() => {
          if (!resetInProgressRef.current) {
            collisionEnabledRef.current = true;
          }
        }, 500);
        
        if (pipesRef.current.length === 0) {
          initializePipes();
        }
      }
      
      const currentPhysics = currentConfigRef.current.physics;
      const jumpPower = birdRef.current.powerUpActive === 'shield' 
        ? currentPhysics.jumpStrength * 1.1 
        : currentPhysics.jumpStrength;
      birdRef.current.velocity = jumpPower;
      
      audioManager.playJump();
    }
  }, [gameStore, audioManager, initializePipes]);

  const handleGameOver = useCallback((reason: string = 'collision') => {
    if (gameOverProcessedRef.current || gameStore.isGameOver || resetInProgressRef.current) {
      return;
    }
    
    console.log('💀 Game Over:', reason);
    gameOverProcessedRef.current = true;
    comboRef.current = 0;
    
    audioManager.stopBackgroundMusic();
    backgroundMusicStartedRef.current = false;
    
    createParticles(
      birdRef.current.x + birdRef.current.width/2, 
      birdRef.current.y + birdRef.current.height/2, 
      'red'
    );
    
    if (gameStore.score > gameStore.highScore) {
      gameStore.setHighScore(gameStore.score);
    }
    
    gameStore.setGameOver(true);
    audioManager.playGameOver();
  }, [gameStore, audioManager, createParticles]);

  const gameLoop = useCallback((currentTime: number) => {
    if (!gameStore.isPlaying || gameStore.isPaused || gameStore.isGameOver || resetInProgressRef.current) {
      return;
    }

    // Calculate delta time
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = currentTime;
    }
    
    deltaTimeRef.current = currentTime - lastFrameTimeRef.current;
    
    // Frame rate limiting
    if (deltaTimeRef.current < FRAME_TIME * 0.75) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    lastFrameTimeRef.current = currentTime;

    // Skip large deltas (tab was in background)
    if (deltaTimeRef.current > 100) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    updateBird(deltaTimeRef.current);
    updatePipes(deltaTimeRef.current);
    checkPowerUpCollection();

    // Only check collision if game has properly started
    if (gameStartedRef.current && collisionEnabledRef.current && !resetInProgressRef.current) {
      if (checkCollision(birdRef.current, pipesRef.current)) {
        handleGameOver('collision');
        return;
      }
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameStore, updateBird, updatePipes, checkPowerUpCollection, checkCollision, handleGameOver, FRAME_TIME]);

  const resetGame = useCallback(() => {
    console.log('🔄 Resetting game');
    
    // Set reset flag to prevent any updates during reset
    resetInProgressRef.current = true;
    
    // Cancel any pending animation frames
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }
    
    // Reset all flags
    gameOverProcessedRef.current = false;
    gameStartedRef.current = false;
    collisionEnabledRef.current = false;
    lastFrameTimeRef.current = 0;
    deltaTimeRef.current = 0;
    gapSizeCache.current.clear();
    
    // Stop audio
    audioManager.stopBackgroundMusic();
    backgroundMusicStartedRef.current = false;
    
    // Completely reinitialize bird with fresh values
    birdRef.current = initializeBird();
    
    // Clear all game objects
    pipesRef.current = [];
    powerUpsRef.current = [];
    particlesRef.current = [];
    lastPipeTimeRef.current = 0;
    lastPowerUpTimeRef.current = 0;
    difficultyRef.current = 1;
    comboRef.current = 0;
    
    // Reset game store
    gameStore.resetGame();
    
    // Clear reset flag after a short delay
    setTimeout(() => {
      resetInProgressRef.current = false;
      console.log('✅ Game reset complete');
    }, 100);
  }, [gameStore, audioManager, initializeBird]);

  // Update bird config when device changes
  useEffect(() => {
    if (!resetInProgressRef.current && !gameStore.isPlaying) {
      const bird = birdRef.current;
      const currentConfig = currentConfigRef.current;
      const currentPhysics = currentConfig.physics;
      
      bird.gravity = currentPhysics.gravity;
      bird.jumpStrength = currentPhysics.jumpStrength;
      bird.width = currentConfig.birdSize * currentConfig.birdScale;
      bird.height = currentConfig.birdSize * currentConfig.birdScale;
      
      console.log('Bird config updated:', {
        device: deviceInfo.deviceType,
        gravity: currentPhysics.gravity,
        jumpStrength: currentPhysics.jumpStrength,
        pipeSpeed: currentConfig.pipeSpeed,
        pipeGap: currentConfig.pipeGap
      });
    }
  }, [deviceInfo.deviceType, gameStore.isPlaying]);

  useEffect(() => {
    if (gameStore.isPlaying && !gameStore.isPaused && !gameStore.isGameOver && !resetInProgressRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStore.isPlaying, gameStore.isPaused, gameStore.isGameOver, gameLoop]);

  useEffect(() => {
    if (gameStore.isMuted !== undefined) {
      if (gameStore.isMuted) {
        audioManager.mute();
      } else {
        audioManager.unmute();
      }
    }
  }, [gameStore.isMuted, audioManager]);

  return {
    bird: birdRef.current,
    pipes: pipesRef.current,
    powerUps: powerUpsRef.current,
    particles: particlesRef.current,
    jump,
    resetGame,
    audioManager,
    difficulty: difficultyRef.current,
    combo: comboRef.current,
    handleGameOver,
    calculateGapSize
  };
};