// src/constants/gameConfig.ts
import { GameConfig } from '@/types';

// Device-specific configuration interface
export interface DeviceGameConfig extends GameConfig {
  birdSize: number;
  birdX: number;
  birdScale: number;
  uiScale: number;
  physics: {
    gravity: number;
    jumpStrength: number;
    maxVelocity: number;
    rotationSpeed: number;
  };
  powerUp: {
    spawnChance: number;
    duration: number;
    speed: number;
    magnetRange: number;
  };
  difficultyProgression: number;
  maxDifficulty: number;
  scoreMultiplier: number;
}

// Base configuration for desktop/web
export const GAME_CONFIG: GameConfig = {
  pipeGap: 160,
  pipeWidth: 55,
  pipeSpeed: 2.4,
  pipeInterval: 1500,  // Fixed: proper milliseconds
  groundHeight: 50,
  canvasWidth: 800,
  canvasHeight: 500
};

// Mobile-specific configuration
export const MOBILE_CONFIG: GameConfig = {
  pipeGap: 175,      // Larger gap for mobile
  pipeWidth: 50,     
  pipeSpeed: 3.0,    // Balanced speed
  pipeInterval: 1800, // Fixed: proper milliseconds
  groundHeight: 45,
  canvasWidth: 360,
  canvasHeight: 640
};

// Bird configuration
export const BIRD_CONFIG = {
  width: 50,
  height: 50,
  initialX: 50,
  initialY: 150
};

// Mobile bird configuration
export const MOBILE_BIRD_CONFIG = {
  width: 45,
  height: 45,
  initialX: 60,
  initialY: 200
};

// Physics configuration - Balanced for smooth gameplay
export const PHYSICS = {
  gravity: 0.45,        // Reduced for better control
  jumpStrength: -7.0,   // Balanced jump strength
  maxVelocity: 10,      // Capped for predictability
  rotationFactor: 0.05,
  maxRotation: 0.5
};

// Mobile physics configuration
export const MOBILE_PHYSICS = {
  gravity: 0.5,         // Balanced gravity
  jumpStrength: -7.5,   // Responsive jump
  maxVelocity: 12,      // Reasonable max speed
  rotationFactor: 0.04,
  maxRotation: 0.4
};

// Difficulty scaling
export const DIFFICULTY_CONFIG = {
  scoreInterval: 10,
  maxDifficulty: 2.5,   // Reduced max difficulty
  speedIncrement: 0.2,  // Gentler progression
  gapDecrement: 3,      // Smaller gap reduction
  minGapDesktop: 135,   // Reasonable minimum
  minGapMobile: 155     // More forgiving on mobile
};

// Power-up configuration
export const POWERUP_CONFIG = {
  spawnChance: 0.2,     // Reduced spawn chance
  duration: 5000,
  mobileDuration: 6000,
  magnetRange: 100,
  mobileMagnetRange: 120
};

// Extended device configurations
export const DESKTOP_CONFIG: DeviceGameConfig = {
  ...GAME_CONFIG,
  birdSize: BIRD_CONFIG.width,
  birdX: BIRD_CONFIG.initialX,
  birdScale: 1,
  uiScale: 1,
  physics: {
    gravity: PHYSICS.gravity,
    jumpStrength: PHYSICS.jumpStrength,
    maxVelocity: PHYSICS.maxVelocity,
    rotationSpeed: PHYSICS.rotationFactor
  },
  powerUp: {
    spawnChance: POWERUP_CONFIG.spawnChance,
    duration: POWERUP_CONFIG.duration,
    speed: GAME_CONFIG.pipeSpeed,
    magnetRange: POWERUP_CONFIG.magnetRange
  },
  difficultyProgression: DIFFICULTY_CONFIG.speedIncrement,
  maxDifficulty: DIFFICULTY_CONFIG.maxDifficulty,
  scoreMultiplier: 1
};

// Mobile Portrait Configuration
export const MOBILE_PORTRAIT_CONFIG: DeviceGameConfig = {
  pipeGap: 180,        // More forgiving gap
  pipeWidth: 50,
  pipeSpeed: 3.2,      // Balanced speed
  pipeInterval: 1800,  
  groundHeight: 45,
  canvasWidth: 360,
  canvasHeight: 640,
  birdSize: MOBILE_BIRD_CONFIG.width,
  birdX: MOBILE_BIRD_CONFIG.initialX,
  birdScale: 1.0,      
  uiScale: 0.9,
  physics: {
    gravity: MOBILE_PHYSICS.gravity,
    jumpStrength: MOBILE_PHYSICS.jumpStrength,
    maxVelocity: MOBILE_PHYSICS.maxVelocity,
    rotationSpeed: MOBILE_PHYSICS.rotationFactor
  },
  powerUp: {
    spawnChance: POWERUP_CONFIG.spawnChance * 0.8,
    duration: POWERUP_CONFIG.mobileDuration,
    speed: 3.2,
    magnetRange: POWERUP_CONFIG.mobileMagnetRange
  },
  difficultyProgression: DIFFICULTY_CONFIG.speedIncrement * 0.7,
  maxDifficulty: DIFFICULTY_CONFIG.maxDifficulty * 0.85,
  scoreMultiplier: 1.2
};

// Mobile Landscape Configuration - FIXED DIMENSIONS
export const MOBILE_LANDSCAPE_CONFIG: DeviceGameConfig = {
  pipeGap: 175,
  pipeWidth: 55,
  pipeSpeed: 3.0,      
  pipeInterval: 1600,  
  groundHeight: 48,
  canvasWidth: 640,    // Fixed: proper width
  canvasHeight: 360,   // Fixed: proper height
  birdSize: 48,
  birdX: 80,           
  birdScale: 1.0,      
  uiScale: 0.95,
  physics: {
    gravity: 0.48,      // Balanced for landscape
    jumpStrength: -7.2,
    maxVelocity: 11,
    rotationSpeed: 0.045
  },
  powerUp: {
    spawnChance: POWERUP_CONFIG.spawnChance * 0.9,
    duration: POWERUP_CONFIG.mobileDuration,
    speed: 3.0,
    magnetRange: 110
  },
  difficultyProgression: DIFFICULTY_CONFIG.speedIncrement * 0.8,
  maxDifficulty: DIFFICULTY_CONFIG.maxDifficulty * 0.9,
  scoreMultiplier: 1.1
};

// Tablet Configuration
export const TABLET_CONFIG: DeviceGameConfig = {
  pipeGap: 165,
  pipeWidth: 60,
  pipeSpeed: 2.8,      
  pipeInterval: 1700,  
  groundHeight: 50,
  canvasWidth: 768,    
  canvasHeight: 1024,  
  birdSize: 52,
  birdX: 70,
  birdScale: 1.05,
  uiScale: 1.05,
  physics: {
    gravity: PHYSICS.gravity * 1.05,
    jumpStrength: PHYSICS.jumpStrength * 1.05,
    maxVelocity: PHYSICS.maxVelocity * 1.05,
    rotationSpeed: PHYSICS.rotationFactor
  },
  powerUp: {
    spawnChance: POWERUP_CONFIG.spawnChance,
    duration: POWERUP_CONFIG.duration,
    speed: 2.8,
    magnetRange: POWERUP_CONFIG.magnetRange * 1.1
  },
  difficultyProgression: DIFFICULTY_CONFIG.speedIncrement * 0.9,
  maxDifficulty: DIFFICULTY_CONFIG.maxDifficulty * 0.95,
  scoreMultiplier: 1
};

// Helper functions
export const getConfig = (isMobile: boolean): GameConfig => {
  return isMobile ? MOBILE_CONFIG : GAME_CONFIG;
};

export const getBirdConfig = (isMobile: boolean) => {
  return isMobile ? MOBILE_BIRD_CONFIG : BIRD_CONFIG;
};

export const getPhysics = (isMobile: boolean) => {
  return isMobile ? MOBILE_PHYSICS : PHYSICS;
};

// Device config helper
export const getDeviceConfig = (deviceType: string): DeviceGameConfig => {
  switch (deviceType) {
    case 'mobile-portrait':
      return MOBILE_PORTRAIT_CONFIG;
    case 'mobile-landscape':
      return MOBILE_LANDSCAPE_CONFIG;
    case 'tablet':
      return TABLET_CONFIG;
    default:
      return DESKTOP_CONFIG;
  }
};