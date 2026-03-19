// src/components/ConfigDebug.tsx
import React from 'react';
import { useDeviceConfig } from '@/hooks/useDeviceConfig';

export const ConfigDebug: React.FC = () => {
  const deviceInfo = useDeviceConfig();
  
  return (
    <div className="fixed bottom-0 left-0 bg-black/80 text-white p-2 text-xs z-50 max-w-xs rounded-tr-lg">
      <div className="font-bold mb-1 text-yellow-400">Debug Info</div>
      <div>Device: {deviceInfo.deviceType}</div>
      <div>Mobile: {deviceInfo.isMobile ? 'Yes' : 'No'}</div>
      <div>Tablet: {deviceInfo.isTablet ? 'Yes' : 'No'}</div>
      <div>Orientation: {deviceInfo.isPortrait ? 'Portrait' : 'Landscape'}</div>
      <div>Screen: {deviceInfo.screenWidth}x{deviceInfo.screenHeight}</div>
      <div>Aspect Ratio: {deviceInfo.aspectRatio.toFixed(2)}</div>
      <div className="mt-1 pt-1 border-t border-white/20">
        <div className="text-green-400">Config Values:</div>
        <div>Pipe Speed: {deviceInfo.config.pipeSpeed}</div>
        <div>Pipe Gap: {deviceInfo.config.pipeGap}</div>
        <div>Pipe Interval: {deviceInfo.config.pipeInterval}</div>
        <div>Gravity: {deviceInfo.config.physics.gravity.toFixed(3)}</div>
        <div>Jump: {deviceInfo.config.physics.jumpStrength.toFixed(2)}</div>
        <div>Max Velocity: {deviceInfo.config.physics.maxVelocity}</div>
      </div>
    </div>
  );
};