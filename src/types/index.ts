//D:\PROJECTS\GAME\Bird-Buddies-Fly(BUTTON PAYMENT)\src\types\index.ts
export interface Character {
  id: number;
  name: string;
  imagePath: string;
  soundFile: string;
  scoreSoundFile?: string;
  description?: string;
  isFree?: boolean;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isMuted?: boolean;
  score: number;
  highScore: number;
  selectedCharacter: Character | null;
}

export interface Bird {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  gravity: number;
  jumpStrength: number;
  rotation: number;
  invulnerable?: boolean;
  powerUpActive?: PowerUp['type'] | null;
  powerUpEndTime: number;
}

export interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
  id: string;
  hasBonus?: boolean;
}

export interface PowerUp {
  x: number;
  y: number;
  type: 'shield' | 'slowTime' | 'doublePoints' | 'magnet';
  id: string;
  collected: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface GameConfig {
  pipeGap: number;
  pipeWidth: number;
  pipeSpeed: number;
  pipeInterval: number;
  groundHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

export interface AudioManager {
  playJump: () => void;
  playScore: () => void;
  playGameOver: () => void;
  playCharacterScore: () => void;
  playCharacterGameOver: () => void;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => boolean;
  testGameOverSound: () => void;
  isMuted: boolean;
  isInitialized: boolean;
}

export interface UserPurchase {
  userId?: string;
  hasLifetimeAccess: boolean;
  purchaseDate?: string;
  transactionId?: string;
  merchantTransactionId?: string;
  amount?: number;
  phoneNumber?: string;
  paymentMethod?: string;
}

export interface PhonePeResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId?: string;
    merchantTransactionId?: string;
    transactionId?: string;
    amount?: number;
    state?: string;
    responseCode?: string;
    paymentInstrument?: any;
    instrumentResponse?: {
      type?: string;
      redirectInfo?: {
        url?: string;
        method?: string;
      };
    };
  };
}



export interface GameConfig {
  pipeGap: number;
  pipeWidth: number;
  pipeSpeed: number;
  pipeInterval: number;
  groundHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}




export interface UserPurchase {
  userId?: string;
  hasLifetimeAccess: boolean;
  purchaseDate?: string;
  transactionId?: string;
  merchantTransactionId?: string;
  amount?: number;
  phoneNumber?: string;
  email?: string;
  paymentMethod?: string;
}