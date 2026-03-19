import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, Character } from '@/types';

interface GameStore extends GameState {
  setPlaying: (playing: boolean) => void;
  setPaused: (paused: boolean) => void;
  setGameOver: (gameOver: boolean) => void;
  setScore: (score: number) => void;
  incrementScore: () => void;
  setHighScore: (highScore: number) => void;
  setSelectedCharacter: (character: Character | null) => void;
  setMuted: (muted: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      isMuted: false,
      score: 0,
      highScore: 0,
      selectedCharacter: null,

      setPlaying: (playing) => set({ isPlaying: playing }),
      setPaused: (paused) => set({ isPaused: paused }),
      setGameOver: (gameOver) => set({ isGameOver: gameOver }),
      setScore: (score) => set({ score }),
      incrementScore: () => set((state) => ({ score: state.score + 1 })),
      setHighScore: (highScore) => set({ highScore }),
      setSelectedCharacter: (character) => set({ selectedCharacter: character }),
      setMuted: (muted) => set({ isMuted: muted }),
      resetGame: () => {
        // Only update game-related state, not character or settings
        const currentState = get();
        set({
          isPlaying: false,
          isPaused: false,
          isGameOver: false,
          score: 0,
          // Keep these unchanged
          selectedCharacter: currentState.selectedCharacter,
          highScore: currentState.highScore,
          isMuted: currentState.isMuted
        });
      }
    }),
    {
      name: 'bird-buddies-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        highScore: state.highScore,
        isMuted: state.isMuted
      })
    }
  )
);