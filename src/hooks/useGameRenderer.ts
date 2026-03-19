// src/hooks/useGameRenderer.ts
import { useCallback, useEffect, useRef } from 'react';
import { Bird, Pipe, Character, PowerUp, Particle } from '@/types';
import { DeviceGameConfig, DIFFICULTY_CONFIG } from '@/constants/gameConfig';
import { useImagePreloader } from './useImagePreloader';

export const useGameRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  bird: Bird,
  pipes: Pipe[],
  powerUps: PowerUp[] = [],
  particles: Particle[] = [],
  character: Character | null,
  score: number,
  highScore: number,
  isPlaying: boolean,
  isPaused: boolean,
  isGameOver: boolean,
  combo: number = 0,
  deviceType: string,
  deviceConfig: DeviceGameConfig,
  calculateGapSize?: (score: number) => number
) => {
  const animationFrameRef = useRef<number>();
  const cloudOffsetRef = useRef(0);
  const grassOffsetRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  
  const imagePaths = character ? [character.imagePath] : [];
  const { getImage, imagesLoaded, loadingError } = useImagePreloader(imagePaths);

  // OPTIMIZATION: Cache rendering context settings
  const ctxSettingsRef = useRef({
    imageSmoothingEnabled: false,
    imageSmoothingQuality: 'low' as ImageSmoothingQuality
  });

  const isMobile = deviceType.includes('mobile');
  const TARGET_RENDER_FPS = isMobile ? 30 : 60;
  const RENDER_FRAME_TIME = 1000 / TARGET_RENDER_FPS;

  const fallbackCalculateGapSize = useCallback((currentScore: number) => {
    const isMobileDevice = deviceType.includes('mobile');
    const difficulty = Math.min(
      1 + Math.floor(currentScore / DIFFICULTY_CONFIG.scoreInterval) * deviceConfig.difficultyProgression, 
      deviceConfig.maxDifficulty
    );
    const gapReduction = (difficulty - 1) * DIFFICULTY_CONFIG.gapDecrement;
    const baseGap = deviceConfig.pipeGap;
    const minGap = isMobileDevice ? DIFFICULTY_CONFIG.minGapMobile : DIFFICULTY_CONFIG.minGapDesktop;
    const calculatedGap = Math.max(baseGap - gapReduction, minGap);
    
    return calculatedGap;
  }, [deviceConfig, deviceType]);

  // OPTIMIZATION: Simplified background for mobile
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (isMobile) {
      // Simple solid color for mobile
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Simple clouds for mobile (less frequent updates)
      if (frameCountRef.current % 2 === 0) {
        cloudOffsetRef.current += 0.3;
      }
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      const cloudScale = deviceConfig.uiScale;
      
      // Draw fewer clouds on mobile
      ctx.beginPath();
      ctx.arc((cloudOffsetRef.current * 0.5) % (canvas.width + 200) - 200, 50 * cloudScale, 30 * cloudScale, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Original gradient background for desktop
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const hue = (score * 2) % 360;
      skyGradient.addColorStop(0, `hsl(${200 + hue/3}, 70%, 70%)`);
      skyGradient.addColorStop(0.7, '#98D8E8');
      skyGradient.addColorStop(1, '#E0F7FA');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      cloudOffsetRef.current += 0.3;
      
      const cloudScale = deviceConfig.uiScale;
      const clouds = [
        { x: (cloudOffsetRef.current * 0.5) % (canvas.width + 200) - 200, y: 50 * cloudScale, r: 30 * cloudScale },
        { x: (cloudOffsetRef.current * 0.3) % (canvas.width + 300) - 100, y: 100 * cloudScale, r: 20 * cloudScale },
        { x: (cloudOffsetRef.current * 0.4) % (canvas.width + 250) - 150, y: 70 * cloudScale, r: 25 * cloudScale }
      ];

      clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
        ctx.arc(cloud.x + 15 * cloudScale, cloud.y - 10 * cloudScale, cloud.r - 5 * cloudScale, 0, Math.PI * 2);
        ctx.arc(cloud.x + 30 * cloudScale, cloud.y, cloud.r, 0, Math.PI * 2);
        ctx.arc(cloud.x + 15 * cloudScale, cloud.y + 10 * cloudScale, cloud.r - 5 * cloudScale, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [score, deviceConfig.uiScale, isMobile]);

  // OPTIMIZATION: Simplified power-ups for mobile
  const drawPowerUps = useCallback((ctx: CanvasRenderingContext2D) => {
    if (powerUps.length === 0) return;
    
    const size = 30 * deviceConfig.uiScale;
    
    powerUps.forEach(powerUp => {
      ctx.save();
      
      // Skip pulsing effect on mobile
      if (!isMobile) {
        const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.2;
        ctx.translate(powerUp.x, powerUp.y);
        ctx.scale(pulse, pulse);
      } else {
        ctx.translate(powerUp.x, powerUp.y);
      }
      
      // Simple circle for all power-ups on mobile
      if (isMobile) {
        const colors: Record<PowerUp['type'], string> = {
          shield: '#00BFFF',
          slowTime: '#FFD700',
          doublePoints: '#FF69B4',
          magnet: '#FF4500'
        };
        
        ctx.fillStyle = colors[powerUp.type];
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Simple icon
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(14 * deviceConfig.uiScale)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons: Record<PowerUp['type'], string> = {
          shield: 'S',
          slowTime: '⏱',
          doublePoints: '2x',
          magnet: 'M'
        };
        ctx.fillText(icons[powerUp.type], 0, 0);
      } else {
        // Original detailed shapes for desktop
        const colors: Record<PowerUp['type'], string> = {
          shield: '#00BFFF',
          slowTime: '#FFD700',
          doublePoints: '#FF69B4',
          magnet: '#FF4500'
        };
        
        ctx.fillStyle = colors[powerUp.type];
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2 * deviceConfig.uiScale;
        
        switch(powerUp.type) {
          case 'shield':
            ctx.beginPath();
            ctx.moveTo(0, -size/2);
            ctx.lineTo(size/2, -size/4);
            ctx.lineTo(size/2, size/3);
            ctx.lineTo(0, size/2);
            ctx.lineTo(-size/2, size/3);
            ctx.lineTo(-size/2, -size/4);
            ctx.closePath();
            break;
          case 'slowTime':
            ctx.beginPath();
            ctx.arc(0, 0, size/2, 0, Math.PI * 2);
            break;
          case 'doublePoints':
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
              const x = Math.cos(angle) * size/2;
              const y = Math.sin(angle) * size/2;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
              
              const innerAngle = angle + Math.PI / 5;
              const innerX = Math.cos(innerAngle) * size/4;
              const innerY = Math.sin(innerAngle) * size/4;
              ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            break;
          case 'magnet':
            ctx.beginPath();
            ctx.arc(0, 0, size/2, Math.PI, 0, false);
            ctx.lineTo(size/2, size/3);
            ctx.lineTo(size/3, size/3);
            ctx.lineTo(size/3, 0);
            ctx.arc(0, 0, size/3, 0, Math.PI, true);
            ctx.lineTo(-size/3, size/3);
            ctx.lineTo(-size/2, size/3);
            ctx.closePath();
            break;
        }
        
        ctx.fill();
        ctx.stroke();
        
        // Glow effect only on desktop
        ctx.shadowColor = colors[powerUp.type];
        ctx.shadowBlur = 15 * deviceConfig.uiScale;
        ctx.fill();
      }
      
      ctx.restore();
    });
  }, [powerUps, deviceConfig.uiScale, isMobile]);

  // OPTIMIZATION: Draw particles only on desktop or limit on mobile
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    if (particles.length === 0) return;
    
    // Skip particles on very low-end mobile devices
    if (isMobile && particles.length > 10) {
      // Draw only first 10 particles on mobile
      particles.slice(0, 10).forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 30;
        const particleSize = 3 * deviceConfig.uiScale;
        ctx.fillRect(particle.x - particleSize/2, particle.y - particleSize/2, particleSize, particleSize);
      });
    } else {
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 30;
        const particleSize = 4 * deviceConfig.uiScale;
        ctx.fillRect(particle.x - particleSize/2, particle.y - particleSize/2, particleSize, particleSize);
      });
    }
    ctx.globalAlpha = 1;
  }, [particles, deviceConfig.uiScale, isMobile]);

  // OPTIMIZATION: Simplified ground for mobile
  const drawGround = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const groundHeight = deviceConfig.groundHeight;
    
    if (isMobile) {
      // Simple solid ground for mobile
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
      
      // Simple grass line
      ctx.fillStyle = '#228B22';
      ctx.fillRect(0, canvas.height - groundHeight - 5, canvas.width, 5);
    } else {
      // Original detailed ground for desktop
      if (isPlaying && !isPaused && !isGameOver) {
        grassOffsetRef.current = (grassOffsetRef.current + deviceConfig.pipeSpeed) % 10;
      }
      
      const groundGradient = ctx.createLinearGradient(0, canvas.height - groundHeight, 0, canvas.height);
      groundGradient.addColorStop(0, '#8B4513');
      groundGradient.addColorStop(0.5, '#A0522D');
      groundGradient.addColorStop(1, '#654321');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

      ctx.fillStyle = '#228B22';
      for (let x = -grassOffsetRef.current; x < canvas.width + 10; x += 5) {
        const grassHeight = 5 + Math.sin(x * 0.1) * 3;
        ctx.fillRect(x, canvas.height - groundHeight - grassHeight, 3, grassHeight);
      }
    }
  }, [isPlaying, isPaused, isGameOver, deviceConfig.groundHeight, deviceConfig.pipeSpeed, isMobile]);

  const drawBird = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotation);
    
    const flapScale = isPlaying && !isGameOver && !isMobile ? 1 + Math.sin(Date.now() * 0.01) * 0.05 : 1;
    ctx.scale(deviceConfig.birdScale * flapScale, deviceConfig.birdScale);
    
    if (character) {
      const img = getImage(character.imagePath);
      if (img && img.complete && img.naturalWidth > 0) {
        // Reduce shadow effects on mobile
        if (!isMobile) {
          if (bird.powerUpActive) {
            ctx.shadowColor = bird.powerUpActive === 'shield' ? '#00BFFF' :
                           bird.powerUpActive === 'slowTime' ? '#FFD700' :
                           bird.powerUpActive === 'doublePoints' ? '#FF69B4' : '#FF4500';
            ctx.shadowBlur = 20 * deviceConfig.uiScale;
          } else {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 5 * deviceConfig.uiScale;
          }
          ctx.shadowOffsetX = 2 * deviceConfig.uiScale;
          ctx.shadowOffsetY = 2 * deviceConfig.uiScale;
        }
        
        ctx.drawImage(img, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
      } else {
        drawFallbackBird(ctx, bird);
      }
    } else {
      drawFallbackBird(ctx, bird);
    }
    
    // Shield visual (simplified for mobile)
    if (bird.powerUpActive === 'shield') {
      ctx.strokeStyle = 'rgba(0, 191, 255, 0.5)';
      ctx.lineWidth = isMobile ? 2 : 3 * deviceConfig.uiScale;
      ctx.beginPath();
      ctx.arc(0, 0, bird.width * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }, [bird, character, getImage, isPlaying, isGameOver, deviceConfig, isMobile]);

  const drawFallbackBird = (ctx: CanvasRenderingContext2D, bird: Bird) => {
    // Simplified bird for mobile
    if (isMobile) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, bird.width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Simple eye
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(bird.width/4, -bird.height/6, 2 * deviceConfig.uiScale, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Original detailed bird for desktop
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 2 * deviceConfig.uiScale;
      
      ctx.beginPath();
      ctx.ellipse(0, 0, bird.width/2, bird.height/2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.ellipse(-5 * deviceConfig.uiScale, 0, bird.width/3, bird.height/4, -0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(bird.width/4, -bird.height/6, 5 * deviceConfig.uiScale, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(bird.width/4 + 1, -bird.height/6, 2 * deviceConfig.uiScale, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FF6347';
      ctx.beginPath();
      ctx.moveTo(bird.width/2 - 5 * deviceConfig.uiScale, 0);
      ctx.lineTo(bird.width/2 + 5 * deviceConfig.uiScale, 0);
      ctx.lineTo(bird.width/2, 5 * deviceConfig.uiScale);
      ctx.closePath();
      ctx.fill();
    }
  };

  // OPTIMIZATION: Simplified pipes for mobile
  const drawPipes = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.save();
    
    // Disable antialiasing on mobile for better performance
    if (isMobile) {
      ctx.imageSmoothingEnabled = false;
    }
    
    pipes.forEach(pipe => {
      if (pipe.x + deviceConfig.pipeWidth < -50 || pipe.x > canvas.width + 50) {
        return;
      }

      const isBonus = pipe.hasBonus;
      const gapSize = calculateGapSize ? calculateGapSize(score) : fallbackCalculateGapSize(score);
      
      const availableHeight = canvas.height - deviceConfig.groundHeight;
      const minPipeHeight = deviceType.includes('mobile') ? 100 : 80;
      
      let topHeight = pipe.topHeight;
      topHeight = Math.max(minPipeHeight, Math.min(topHeight, availableHeight - gapSize - minPipeHeight));
      
      const bottomPipeY = topHeight + gapSize;
      const bottomPipeHeight = availableHeight - bottomPipeY;
      
      if (topHeight >= minPipeHeight && bottomPipeHeight >= minPipeHeight) {
        // Simplified pipes for mobile
        if (isMobile) {
          ctx.fillStyle = isBonus ? '#FFD700' : '#3A5F3A';
          
          // Top pipe
          ctx.fillRect(Math.round(pipe.x), 0, deviceConfig.pipeWidth, Math.round(topHeight));
          
          // Top pipe cap
          ctx.fillStyle = isBonus ? '#FFA500' : '#1F5F3F';
          ctx.fillRect(
            Math.round(pipe.x - 5 * deviceConfig.uiScale), 
            Math.round(Math.max(0, topHeight - 20 * deviceConfig.uiScale)), 
            deviceConfig.pipeWidth + 10 * deviceConfig.uiScale, 
            Math.min(20 * deviceConfig.uiScale, topHeight)
          );
          
          // Reset to pipe color
          ctx.fillStyle = isBonus ? '#FFD700' : '#3A5F3A';
          
          // Bottom pipe
          ctx.fillRect(
            Math.round(pipe.x), 
            Math.round(bottomPipeY), 
            deviceConfig.pipeWidth, 
            Math.round(bottomPipeHeight)
          );
          
          // Bottom pipe cap
          ctx.fillStyle = isBonus ? '#FFA500' : '#1F5F3F';
          ctx.fillRect(
            Math.round(pipe.x - 5 * deviceConfig.uiScale), 
            Math.round(bottomPipeY), 
            deviceConfig.pipeWidth + 10 * deviceConfig.uiScale, 
            Math.min(20 * deviceConfig.uiScale, bottomPipeHeight)
          );
        } else {
          // Original gradient pipes for desktop
          const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + deviceConfig.pipeWidth, 0);
          
          if (isBonus) {
            pipeGradient.addColorStop(0, '#FFD700');
            pipeGradient.addColorStop(0.5, '#FFA500');
            pipeGradient.addColorStop(1, '#FF8C00');
          } else {
            pipeGradient.addColorStop(0, '#3A5F3A');
            pipeGradient.addColorStop(0.5, '#2E8B57');
            pipeGradient.addColorStop(1, '#245F3F');
          }
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Top pipe
          ctx.fillStyle = pipeGradient;
          ctx.fillRect(Math.round(pipe.x), 0, deviceConfig.pipeWidth, Math.round(topHeight));
          
          // Top pipe cap
          ctx.fillStyle = isBonus ? '#FFA500' : '#1F5F3F';
          ctx.fillRect(
            Math.round(pipe.x - 5 * deviceConfig.uiScale), 
            Math.round(Math.max(0, topHeight - 20 * deviceConfig.uiScale)), 
            deviceConfig.pipeWidth + 10 * deviceConfig.uiScale, 
            Math.min(20 * deviceConfig.uiScale, topHeight)
          );
          
          // Bottom pipe
          ctx.fillStyle = pipeGradient;
          ctx.fillRect(
            Math.round(pipe.x), 
            Math.round(bottomPipeY), 
            deviceConfig.pipeWidth, 
            Math.round(bottomPipeHeight)
          );
          
          // Bottom pipe cap
          ctx.fillStyle = isBonus ? '#FFA500' : '#1F5F3F';
          ctx.fillRect(
            Math.round(pipe.x - 5 * deviceConfig.uiScale), 
            Math.round(bottomPipeY), 
            deviceConfig.pipeWidth + 10 * deviceConfig.uiScale, 
            Math.min(20 * deviceConfig.uiScale, bottomPipeHeight)
          );
          
          // Bonus indicator (desktop only)
          if (isBonus && !pipe.passed && gapSize > 60) {
            ctx.save();
            ctx.fillStyle = 'gold';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2 * deviceConfig.uiScale;
            ctx.font = `bold ${Math.round(16 * deviceConfig.uiScale)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const textY = topHeight + gapSize / 2;
            const textX = pipe.x + deviceConfig.pipeWidth / 2;
            
            if (textY > 30 && textY < canvas.height - 30) {
              ctx.strokeText('+3', textX, textY);
              ctx.fillText('+3', textX, textY);
            }
            ctx.restore();
          }
        }
      }
    });
    
    ctx.restore();
  }, [pipes, score, deviceConfig, deviceType, calculateGapSize, fallbackCalculateGapSize, isMobile]);

  // OPTIMIZATION: Simplified UI for mobile
  const drawUI = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.save();
    
    const uiScale = deviceConfig.uiScale;
    const fontSize = Math.round(isMobile ? 20 : 24 * uiScale);
    const padding = Math.round(isMobile ? 10 : 15 * uiScale);
    
    // Simplified score display for mobile
    if (isMobile) {
      // Score background (smaller on mobile)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(5, 5, 80, 30);
      ctx.fillRect(canvas.width - 85, 5, 80, 30);
      
      ctx.fillStyle = 'white';
      ctx.font = `bold ${fontSize}px Arial`;
      
      // Current Score
      ctx.textAlign = 'left';
      ctx.fillText(`${score}`, padding, 25);
      
      // High Score
      ctx.textAlign = 'right';
      ctx.fillText(`${highScore}`, canvas.width - padding, 25);
      
      // Combo indicator (simplified)
      if (combo > 5) {
        ctx.fillStyle = 'gold';
        ctx.font = `bold ${Math.round(18 * uiScale)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(`x${combo}!`, canvas.width / 2, 25);
      }
    } else {
      // Original detailed UI for desktop
      const boxWidth = Math.round(150 * uiScale);
      const boxHeight = Math.round(35 * uiScale);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(5, 5, boxWidth, boxHeight);
      ctx.fillRect(canvas.width - boxWidth - 5, 5, boxWidth, boxHeight);
      
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(2, Math.round(3 * uiScale));
      ctx.font = `bold ${fontSize}px Arial`;
      
      ctx.textAlign = 'left';
      const scoreText = `Score: ${score}`;
      ctx.strokeText(scoreText, padding, Math.round(30 * uiScale));
      ctx.fillText(scoreText, padding, Math.round(30 * uiScale));
      
      ctx.textAlign = 'right';
      const bestText = `Best: ${highScore}`;
      ctx.strokeText(bestText, canvas.width - padding, Math.round(30 * uiScale));
      ctx.fillText(bestText, canvas.width - padding, Math.round(30 * uiScale));
      
      if (combo > 5) {
        const comboWidth = Math.round(120 * uiScale);
        const comboHeight = Math.round(30 * uiScale);
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.fillRect(canvas.width / 2 - comboWidth/2, 5, comboWidth, comboHeight);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(20 * uiScale)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(`COMBO x${combo}!`, canvas.width / 2, Math.round(27 * uiScale));
      }
      
      if (bird.powerUpActive) {
        const timeLeft = Math.max(0, (bird.powerUpEndTime || 0) - Date.now()) / 1000;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        const powerUpWidth = Math.round(160 * uiScale);
        const powerUpHeight = Math.round(25 * uiScale);
        ctx.fillRect(canvas.width / 2 - powerUpWidth/2, Math.round(45 * uiScale), powerUpWidth, powerUpHeight);
        ctx.fillStyle = '#00FF00';
        ctx.font = `bold ${Math.round(16 * uiScale)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(
          `${bird.powerUpActive.toUpperCase()} ${timeLeft.toFixed(1)}s`, 
          canvas.width / 2, 
          Math.round(62 * uiScale)
        );
      }
      
      if (character && !deviceType.includes('mobile')) {
        ctx.textAlign = 'center';
        ctx.font = `bold ${Math.round(16 * uiScale)}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(character.name, canvas.width / 2, canvas.height - 10);
      }
    }
    
    ctx.restore();
  }, [score, highScore, character, combo, bird, deviceType, deviceConfig.uiScale, isMobile]);

  const drawGameOverScreen = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.save();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const uiScale = deviceConfig.uiScale;
    
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.round(isMobile ? 3 : 4 * uiScale);
    ctx.font = `bold ${Math.round(isMobile ? 36 : 48 * uiScale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.strokeText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60 * uiScale);
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60 * uiScale);
    
    ctx.font = `bold ${Math.round(isMobile ? 24 : 32 * uiScale)}px Arial`;
    ctx.strokeText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    
    if (score === highScore && score > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold ${Math.round(isMobile ? 20 : 24 * uiScale)}px Arial`;
      ctx.strokeText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 40 * uiScale);
      ctx.fillText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 40 * uiScale);
    }
    
    ctx.fillStyle = 'white';
    ctx.font = `${Math.round(isMobile ? 16 : 18 * uiScale)}px Arial`;
    const restartText = deviceType.includes('mobile') ? 'Tap to restart' : 'Press SPACE to restart';
    ctx.fillText(restartText, canvas.width / 2, canvas.height / 2 + 80 * uiScale);
    
    ctx.restore();
  }, [score, highScore, deviceConfig.uiScale, deviceType, isMobile]);

  const drawPauseScreen = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.save();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const uiScale = deviceConfig.uiScale;
    
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.round(4 * uiScale);
    ctx.font = `bold ${Math.round(isMobile ? 36 : 48 * uiScale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.strokeText('PAUSED', canvas.width / 2, canvas.height / 2);
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    
    ctx.font = `${Math.round(isMobile ? 16 : 18 * uiScale)}px Arial`;
    const resumeText = deviceType.includes('mobile') ? 'Tap to resume' : 'Press P to resume';
    ctx.fillText(resumeText, canvas.width / 2, canvas.height / 2 + 40 * uiScale);
    
    ctx.restore();
  }, [deviceConfig.uiScale, deviceType, isMobile]);

  // OPTIMIZATION: Throttled render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    const currentTime = performance.now();
    
    // OPTIMIZATION: Frame rate limiting for mobile
    if (isMobile) {
      const timeSinceLastRender = currentTime - lastRenderTimeRef.current;
      if (timeSinceLastRender < RENDER_FRAME_TIME * 0.9) {
        return;
      }
      lastRenderTimeRef.current = currentTime;
    }
    
    // OPTIMIZATION: Set context settings once
    if (ctx.imageSmoothingEnabled !== ctxSettingsRef.current.imageSmoothingEnabled) {
      ctx.imageSmoothingEnabled = ctxSettingsRef.current.imageSmoothingEnabled;
      ctx.imageSmoothingQuality = ctxSettingsRef.current.imageSmoothingQuality;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawBackground(ctx, canvas);
    drawPipes(ctx, canvas);
    
    // Draw power-ups and particles less frequently on mobile
    if (!isMobile || frameCountRef.current % 2 === 0) {
      drawPowerUps(ctx);
      drawParticles(ctx);
    }
    
    drawBird(ctx);
    drawGround(ctx, canvas);
    drawUI(ctx, canvas);
    
    // Draw overlays
    if (isGameOver) {
      drawGameOverScreen(ctx, canvas);
    } else if (isPaused && isPlaying) {
      drawPauseScreen(ctx, canvas);
    } else if (!isPlaying && !isGameOver) {
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.round(3 * deviceConfig.uiScale);
      ctx.font = `bold ${Math.round(isMobile ? 24 : 32 * deviceConfig.uiScale)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const startText = deviceType.includes('mobile') ? 'Tap to Start!' : 'Press SPACE to Start!';
      ctx.strokeText(startText, canvas.width / 2, canvas.height / 2);
      ctx.fillText(startText, canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
    
    frameCountRef.current++;
  }, [
    canvasRef,
    drawBackground,
    drawPipes,
    drawPowerUps,
    drawBird,
    drawParticles,
    drawGround,
    drawUI,
    drawGameOverScreen,
    drawPauseScreen,
    isGameOver,
    isPaused,
    isPlaying,
    deviceConfig.uiScale,
    deviceType,
    isMobile,
    RENDER_FRAME_TIME
  ]);

  // OPTIMIZATION: Use RAF with throttling for mobile
  useEffect(() => {
    let rafId: number;
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      if (isMobile) {
        const deltaTime = currentTime - lastTime;
        if (deltaTime >= RENDER_FRAME_TIME) {
          render();
          lastTime = currentTime;
        }
      } else {
        render();
      }
      
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [render, isMobile, RENDER_FRAME_TIME]);

  return { imagesLoaded, loadingError };
};