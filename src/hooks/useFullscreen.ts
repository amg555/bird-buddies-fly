import { useState, useEffect, useCallback } from 'react';

interface FullscreenOptions {
  autoEnter?: boolean;
  onMobile?: boolean;
}

export const useFullscreen = (options: FullscreenOptions = {}) => {
  const { autoEnter = false, onMobile = true } = options;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if fullscreen API is supported
    const supported = !!(
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
    );
    setIsSupported(supported);

    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Auto enter fullscreen if specified
    if (autoEnter && supported && (!onMobile || isMobile)) {
      enterFullscreen();
    }
  }, [autoEnter, onMobile]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = useCallback(() => {
    if (!isSupported) return;

    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
      (elem as any).mozRequestFullScreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }

    // Try to lock orientation to landscape (simplified approach)
    try {
      if ('orientation' in screen && 'lock' in (screen as any).orientation) {
        (screen as any).orientation.lock('landscape').catch(() => {
          console.log('Orientation lock not supported');
        });
      }
    } catch (error) {
      console.log('Orientation lock not available');
    }
  }, [isSupported]);

  const exitFullscreen = useCallback(() => {
    if (!isFullscreen) return;

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }

    // Unlock orientation (simplified approach)
    try {
      if ('orientation' in screen && 'unlock' in (screen as any).orientation) {
        (screen as any).orientation.unlock();
      }
    } catch (error) {
      console.log('Orientation unlock not available');
    }
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    isSupported,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
};