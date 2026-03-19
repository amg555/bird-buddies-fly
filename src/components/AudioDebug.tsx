// src/components/AudioDebug.tsx
import React from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { useAudioManager } from '@/hooks/useAudioManager';

export const AudioDebug: React.FC = () => {
  const gameStore = useGameStore();
  const audioManager = useAudioManager(gameStore.selectedCharacter || undefined);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs z-50 backdrop-blur-sm">
      <h3 className="font-bold mb-2 text-yellow-400">🔊 Audio Debug Panel</h3>
      <div className="space-y-1">
        <p className="flex justify-between">
          <span>Character:</span>
          <span className="text-green-400">{gameStore.selectedCharacter?.name || 'None'}</span>
        </p>
        <p className="flex justify-between">
          <span>Game Over Sound:</span>
          <span className="text-blue-400 text-[10px]">{gameStore.selectedCharacter?.soundFile || 'None'}</span>
        </p>
        <p className="flex justify-between">
          <span>Score Sound:</span>
          <span className="text-blue-400 text-[10px]">{gameStore.selectedCharacter?.scoreSoundFile || 'Default'}</span>
        </p>
        <p className="flex justify-between">
          <span>Muted:</span>
          <span className={audioManager.isMuted ? 'text-red-400' : 'text-green-400'}>
            {audioManager.isMuted ? 'Yes' : 'No'}
          </span>
        </p>
        <p className="flex justify-between">
          <span>Audio Ready:</span>
          <span className={audioManager.isInitialized ? 'text-green-400' : 'text-red-400'}>
            {audioManager.isInitialized ? 'Yes' : 'No'}
          </span>
        </p>
        <p className="flex justify-between">
          <span>Game State:</span>
          <span className={gameStore.isGameOver ? 'text-red-400' : gameStore.isPlaying ? 'text-green-400' : 'text-yellow-400'}>
            {gameStore.isGameOver ? 'Game Over' : gameStore.isPlaying ? 'Playing' : 'Ready'}
          </span>
        </p>
        <p className="flex justify-between">
          <span>Score:</span>
          <span className="text-yellow-400">{gameStore.score}</span>
        </p>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            console.log('🧪 Testing game over sound...');
            audioManager.testGameOverSound();
          }}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs transition-colors"
        >
          Test Game Over
        </button>
        <button
          onClick={() => {
            console.log('🧪 Testing score sound...');
            audioManager.playScore();
          }}
          className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs transition-colors"
        >
          Test Score
        </button>
        <button
          onClick={() => {
            console.log('🧪 Testing jump sound...');
            audioManager.playJump();
          }}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs transition-colors"
        >
          Test Jump
        </button>
        <button
          onClick={() => {
            const newMuted = audioManager.toggleMute();
            console.log(`🔊 Audio ${newMuted ? 'muted' : 'unmuted'}`);
          }}
          className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors"
        >
          Toggle Mute
        </button>
      </div>
      
      <div className="mt-2 text-[10px] text-gray-400">
        <p>Press buttons to test sounds</p>
        <p>Check console for logs</p>
      </div>
    </div>
  );
};