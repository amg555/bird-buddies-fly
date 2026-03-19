// src/hooks/useDeviceConfig.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  DESKTOP_CONFIG, 
  MOBILE_PORTRAIT_CONFIG, 
  MOBILE_LANDSCAPE_CONFIG, 
  TABLET_CONFIG,
  DeviceGameConfig 
} from '@/constants/gameConfig';

export type DeviceType = 'desktop' | 'mobile-portrait' | 'mobile-landscape' | 'tablet';

interface DeviceInfo {
  deviceType: DeviceType;
  config: DeviceGameConfig;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  aspectRatio: number;
  pixelRatio: number;
}

export const useDeviceConfig = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Initial state
    return {
      deviceType: 'desktop',
      config: DESKTOP_CONFIG,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isPortrait: false,
      isLandscape: true,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      aspectRatio: window.innerWidth / window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1
    };
  });

  const detectDevice = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Enhanced mobile detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isIOSDevice = /iphone|ipad|ipod/i.test(userAgent);
    const isAndroidDevice = /android/i.test(userAgent);
    
    // Size-based detection
    const isMobileSize = width <= 768;
    const isTabletSize = width > 768 && width <= 1024;
    
    // Combined detection
    const isMobile = (isMobileUserAgent || (isTouchDevice && isMobileSize)) && !isTabletSize;
    const isTablet = (isTouchDevice && isTabletSize) || /ipad/i.test(userAgent);
    
    let deviceType: DeviceType;
    let config: DeviceGameConfig;
    
    if (isMobile) {
      if (aspectRatio > 1) {
        // Mobile landscape
        deviceType = 'mobile-landscape';
        config = { ...MOBILE_LANDSCAPE_CONFIG };
      } else {
        // Mobile portrait
        deviceType = 'mobile-portrait';
        config = { ...MOBILE_PORTRAIT_CONFIG };
      }
      
      // iOS-specific adjustments
      if (isIOSDevice) {
        config.physics.gravity *= 0.95; // Slightly less gravity for iOS
        config.physics.jumpStrength *= 1.05; // Slightly stronger jump
      }
      
      // Android-specific adjustments
      if (isAndroidDevice) {
        config.pipeSpeed *= 0.98; // Slightly slower for Android
      }
      
      // High DPI screen adjustments
      if (pixelRatio > 2) {
        config.birdScale *= 0.95; // Slightly smaller on high DPI
        config.uiScale *= 0.95;
      }
      
    } else if (isTablet) {
      deviceType = 'tablet';
      config = { ...TABLET_CONFIG };
      
      // iPad specific adjustments
      if (/ipad/i.test(userAgent)) {
        config.physics.gravity *= 0.97;
        config.pipeGap *= 1.05;
      }
    } else {
      deviceType = 'desktop';
      config = { ...DESKTOP_CONFIG };
      
      // Large screen adjustments
      if (width > 1920) {
        config.pipeSpeed *= 1.1;
        config.difficultyProgression *= 1.1;
      }
    }
    
    // Aspect ratio adjustments
    if (aspectRatio < 0.5) {
      // Very tall screens (like phones in portrait)
      config.pipeGap *= 1.1;
      config.physics.gravity *= 0.9;
    } else if (aspectRatio > 2) {
      // Very wide screens
      config.pipeInterval *= 0.9;
      config.pipeSpeed *= 1.05;
    }
    
    const newDeviceInfo: DeviceInfo = {
      deviceType,
      config,
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
      isPortrait: aspectRatio < 1,
      isLandscape: aspectRatio >= 1,
      screenWidth: width,
      screenHeight: height,
      aspectRatio,
      pixelRatio
    };
    
    setDeviceInfo(newDeviceInfo);
    
    console.log('Device Configuration Updated:', {
      type: deviceType,
      screen: `${width}x${height}`,
      ratio: aspectRatio.toFixed(2),
      dpr: pixelRatio,
      mobile: isMobile,
      tablet: isTablet,
      userAgent: userAgent.substring(0, 50)
    });
  }, []);

  useEffect(() => {
    // Initial detection
    detectDevice();
    
    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(detectDevice, 150);
    };
    
    // Orientation change handler
    const handleOrientationChange = () => {
      // Wait for orientation change to complete
      setTimeout(detectDevice, 350);
    };
    
    // Visibility change handler (for mobile browsers)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(detectDevice, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also listen for device rotation on modern browsers
    if (window.screen && 'orientation' in window.screen) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (window.screen && 'orientation' in window.screen) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, [detectDevice]);

  return deviceInfo;
};