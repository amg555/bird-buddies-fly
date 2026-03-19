import { useRef, useCallback, useEffect } from 'react';
import { Character } from '@/types';

export const useAudioManager = (character?: Character) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const isMutedRef = useRef(false);
  const volumeRef = useRef(0.8);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize audio elements
  useEffect(() => {
    if (!character) return;

    console.log('🎵 Initializing audio for:', character.name);

    // Clear existing audio
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    audioRefs.current = {};

    // Define all sound files
    const sounds = {
      jump: '/sounds/pass.mp3',
      defaultScore: '/sounds/pass-through.mp3',
      characterScore: character.scoreSoundFile || '/sounds/pass-through.mp3',
      genericGameOver: '/sounds/hi.mp3',
      characterGameOver: character.soundFile, // Character's game over voice
      backgroundMusic: '/sounds/pass.mp3'
    };

    // Create audio elements synchronously
    Object.entries(sounds).forEach(([key, path]) => {
      if (!path) return;

      try {
        const audio = new Audio(path);
        audio.preload = 'auto';
        
        // Set volume
        if (key === 'backgroundMusic') {
          audio.volume = volumeRef.current * 0.2;
          audio.loop = true;
          backgroundMusicRef.current = audio;
        } else if (key === 'characterGameOver') {
          // Game over sounds should be louder
          audio.volume = volumeRef.current;
        } else {
          audio.volume = volumeRef.current * 0.7;
        }
        
        audioRefs.current[key] = audio;
        
        // Preload important sounds
        if (key === 'characterGameOver' || key === 'genericGameOver') {
          audio.load();
          console.log(`📢 Preloading ${key}: ${path}`);
        }
      } catch (error) {
        console.error(`Failed to create audio for ${key}:`, error);
      }
    });

    isInitializedRef.current = true;
    console.log('✅ Audio initialized with sounds:', Object.keys(audioRefs.current));

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
      });
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
      isInitializedRef.current = false;
    };
  }, [character]);

  const playSound = useCallback((soundKey: string, volume?: number) => {
    if (isMutedRef.current) {
      console.log(`🔇 Sound muted: ${soundKey}`);
      return Promise.resolve();
    }

    const audio = audioRefs.current[soundKey];
    if (!audio) {
      console.warn(`⚠️ Audio not found: ${soundKey}`);
      return Promise.resolve();
    }

    console.log(`🔊 Attempting to play: ${soundKey}`);

    return new Promise<void>((resolve) => {
      try {
        // Reset the audio
        audio.currentTime = 0;
        
        // Set volume if specified
        if (volume !== undefined) {
          audio.volume = Math.min(1, Math.max(0, volume));
        }
        
        // Play the audio
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`✅ Successfully playing: ${soundKey}`);
              resolve();
            })
            .catch(error => {
              console.error(`❌ Failed to play ${soundKey}:`, error);
              
              // Try to play on next user interaction
              const playOnInteraction = () => {
                audio.play()
                  .then(() => console.log(`✅ Played ${soundKey} after interaction`))
                  .catch(e => console.error(`❌ Still failed to play ${soundKey}:`, e));
              };
              
              document.addEventListener('click', playOnInteraction, { once: true });
              document.addEventListener('touchstart', playOnInteraction, { once: true });
              
              resolve();
            });
        } else {
          console.log(`✅ Playing: ${soundKey} (no promise)`);
          resolve();
        }
      } catch (error) {
        console.error(`❌ Error playing ${soundKey}:`, error);
        resolve();
      }
    });
  }, []);

  const playJump = useCallback(() => {
    return playSound('jump', volumeRef.current * 0.4);
  }, [playSound]);

  const playScore = useCallback(() => {
    return playSound('characterScore', volumeRef.current * 0.6);
  }, [playSound]);

  const playCharacterScore = useCallback(() => {
    if (audioRefs.current.characterScore) {
      return playSound('characterScore', volumeRef.current * 0.6);
    } else {
      return playSound('defaultScore', volumeRef.current * 0.6);
    }
  }, [playSound]);

  // IMPROVED GAME OVER FUNCTION - Better handling of audio interruptions
  const playGameOver = useCallback(async () => {
    console.log('🎮 === GAME OVER SOUND TRIGGERED ===');
    
    // Stop all other sounds first
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key !== 'characterGameOver' && key !== 'genericGameOver') {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // Stop background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      console.log('🔇 Background music stopped');
    }
    
    // Don't play if muted
    if (isMutedRef.current) {
      console.log('🔇 Audio is muted, skipping game over sound');
      return;
    }
    
    // Small delay to ensure audio context is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Play generic game over sound first (optional, quieter)
      if (audioRefs.current.genericGameOver) {
        console.log('📢 Playing generic game over sound...');
        const genericAudio = audioRefs.current.genericGameOver;
        genericAudio.currentTime = 0;
        genericAudio.volume = volumeRef.current * 0.3;
        
        // Don't wait for generic sound to finish, just start it
        genericAudio.play().catch(err => {
          console.log('Generic game over sound skipped:', err.message);
        });
      }
      
      // Play character's game over voice after a short delay
      if (audioRefs.current.characterGameOver && character) {
        console.log(`🎭 Playing ${character.name}'s game over voice: ${character.soundFile}`);
        
        setTimeout(() => {
          const characterAudio = audioRefs.current.characterGameOver;
          if (characterAudio) {
            characterAudio.currentTime = 0;
            characterAudio.volume = volumeRef.current;
            
            characterAudio.play()
              .then(() => {
                console.log(`✅ ${character.name}'s game over voice is playing`);
              })
              .catch(err => {
                console.error(`❌ Failed to play character voice:`, err);
                // Try again on next user interaction
                const retryPlay = () => {
                  characterAudio.play()
                    .then(() => console.log(`✅ Character voice played after retry`))
                    .catch(e => console.error(`❌ Retry also failed:`, e));
                };
                
                document.addEventListener('click', retryPlay, { once: true });
                document.addEventListener('touchstart', retryPlay, { once: true });
              });
          }
        }, 400); // Delay character voice slightly
      } else {
        console.warn('⚠️ No character game over sound available');
      }
    } catch (error) {
      console.error('❌ Error in playGameOver:', error);
    }
  }, [character]);

  const playCharacterGameOver = useCallback(() => {
    return playGameOver();
  }, [playGameOver]);

  const startBackgroundMusic = useCallback(() => {
    if (!isMutedRef.current && backgroundMusicRef.current && isInitializedRef.current) {
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.play()
        .then(() => console.log('🎵 Background music started'))
        .catch(err => console.error('❌ Background music failed:', err));
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      console.log('🔇 Background music stopped');
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume));
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key === 'backgroundMusic') {
        audio.volume = volumeRef.current * 0.2;
      } else if (key === 'characterGameOver' || key === 'genericGameOver') {
        audio.volume = volumeRef.current;
      } else {
        audio.volume = volumeRef.current * 0.7;
      }
    });
  }, []);

  const mute = useCallback(() => {
    isMutedRef.current = true;
    stopBackgroundMusic();
    console.log('🔇 Audio muted');
  }, [stopBackgroundMusic]);

  const unmute = useCallback(() => {
    isMutedRef.current = false;
    console.log('🔊 Audio unmuted');
  }, []);

  const toggleMute = useCallback(() => {
    if (isMutedRef.current) {
      unmute();
    } else {
      mute();
    }
    return isMutedRef.current;
  }, [mute, unmute]);

  // Test function
  const testGameOverSound = useCallback(async () => {
    console.log('🧪 === TESTING GAME OVER SOUND ===');
    await playGameOver();
  }, [playGameOver]);

  return {
    playJump,
    playScore,
    playCharacterScore,
    playGameOver,
    playCharacterGameOver,
    startBackgroundMusic,
    stopBackgroundMusic,
    setVolume,
    mute,
    unmute,
    toggleMute,
    testGameOverSound,
    isMuted: isMutedRef.current,
    isInitialized: isInitializedRef.current
  };
};