'use client';

import React, { useEffect, useRef } from 'react';
import { Entity, Rect, updatePhysics, JUMP_FORCE, MOVE_SPEED, checkCollision } from '@/lib/physics';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function GameHUD() {
  const stars = useStore((state) => state.stars);
  const timer = useStore((state) => state.timer);

  return (
    <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none">
      <div className="bg-white border-neo px-2 py-0.5 rounded-lg text-xs font-black shadow-neo pointer-events-auto">
        STARS: {stars}
      </div>
      <div className="bg-white border-neo px-2 py-0.5 rounded-lg text-xs font-black shadow-neo pointer-events-auto">
        TIME: {timer}s
      </div>
    </div>
  );
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const saveSession = useStore((state) => state.saveSession);
  const stopGame = useStore((state) => state.stopGame);
  
  const playerRef = useRef<Entity>({
    x: 50,
    y: 200,
    width: 32,
    height: 32,
    vx: 0,
    vy: 0,
    isGrounded: false,
    jumpCount: 0
  });

  const platformsRef = useRef<(Rect & { type?: 'rect' | 'triangle' })[]>([]);
  const starsRef = useRef<Rect[]>([]);
  const cameraX = useRef(0);
  const lastGeneratedX = useRef(0);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const generateChunk = (startX: number, width: number) => {
    const newPlatforms: (Rect & { type?: 'rect' | 'triangle' })[] = [];
    const newStars: Rect[] = [];
    
    // Procedural generation logic
    let currentX = startX;
    while (currentX < startX + width) {
      const pWidth = 100 + Math.random() * 200;
      const pGap = 50 + Math.random() * 150;
      const pY = 100 + Math.random() * 150; // Reduced Y range for shorter height
      const type = Math.random() > 0.3 ? 'rect' : 'triangle';
      
      newPlatforms.push({
        x: currentX,
        y: pY,
        width: pWidth,
        height: type === 'triangle' ? 80 : 20, // Reduced height for triangle as well
        type
      });

      // Add a star above the platform
      if (Math.random() > 0.5) {
        newStars.push({
          x: currentX + pWidth / 2 - 8,
          y: pY - 40,
          width: 16,
          height: 16
        });
      }

      currentX += pWidth + pGap;
    }

    platformsRef.current = [...platformsRef.current, ...newPlatforms];
    starsRef.current = [...starsRef.current, ...newStars];
    lastGeneratedX.current = startX + width;
  };

  useEffect(() => {
    // Initial generation
    platformsRef.current = [
      { x: 0, y: 250, width: 800, height: 50, type: 'rect' }
    ];
    generateChunk(800, 2000);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Use both key and code for robustness
      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.code] = true;
      
      const p = playerRef.current;
      const isJumpKey = 
        e.key.toLowerCase() === 'w' || 
        e.code === 'KeyW' || 
        e.key === 'ArrowUp' || 
        e.code === 'ArrowUp' || 
        e.key === ' ' || 
        e.code === 'Space';

      if (isJumpKey) {
        if (p.isGrounded) {
          p.vy = JUMP_FORCE;
          p.jumpCount = 1;
        } else if (p.jumpCount < 2) {
          p.vy = JUMP_FORCE;
          p.jumpCount = 2;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const render = (time: number) => {
      const p = playerRef.current;
      const platforms = platformsRef.current;
      
      // Infinite Generation Check
      if (p.x + canvas.width > lastGeneratedX.current) {
        generateChunk(lastGeneratedX.current, 2000);
        // Garbage collection: Keep only platforms in view or ahead
        platformsRef.current = platformsRef.current.filter(plat => plat.x + plat.width > cameraX.current - 1000);
        starsRef.current = starsRef.current.filter(star => star.x + star.width > cameraX.current - 1000);
      }

      // Input
      p.vx = 0;
      const leftPressed = keysPressed.current['arrowleft'] || keysPressed.current['a'] || keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft'];
      const rightPressed = keysPressed.current['arrowright'] || keysPressed.current['d'] || keysPressed.current['KeyD'] || keysPressed.current['ArrowRight'];
      
      if (leftPressed) p.vx = -MOVE_SPEED;
      if (rightPressed) p.vx = MOVE_SPEED;

      useStore.getState().setTimer(Math.floor(time / 1000));
      updatePhysics(p, platformsRef.current);

      // Reset jump count when grounded
      if (p.isGrounded) {
        p.jumpCount = 0;
      }

      // Camera
      const targetCameraX = Math.max(0, p.x - canvas.width / 2);
      cameraX.current += (targetCameraX - cameraX.current) * 0.1;

      // Collisions
      starsRef.current = starsRef.current.filter(star => {
        const collided = checkCollision(p, star);
        if (collided) useStore.getState().addStar();
        return !collided;
      });

      // Game Over: Fall off
      if (p.y > canvas.height + 100) {
        saveSession();
        // Simple Reset for Now
        p.x = 50;
        p.y = 200;
        p.vy = 0;
        cameraX.current = 0;
        // Optionally go back to dashboard
        // stopGame(); 
      }

      // Drawing
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFF9E5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-cameraX.current, 0);

      // Draw World
      platformsRef.current.forEach(plat => {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#FFD700';
        if (plat.type === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(plat.x, plat.y + plat.height);
          ctx.lineTo(plat.x + plat.width / 2, plat.y);
          ctx.lineTo(plat.x + plat.width, plat.y + plat.height);
          ctx.closePath(); ctx.fill(); ctx.stroke();
        } else {
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        }
      });

      starsRef.current.forEach(s => {
        ctx.fillStyle = '#FF5C5C';
        ctx.beginPath(); ctx.arc(s.x + 8, s.y + 8, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });

      // Player
      ctx.fillStyle = 'white'; ctx.strokeStyle = 'black'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(p.x, p.y, p.width, p.height, 8); ctx.fill(); ctx.stroke();
      
      // Face
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(p.x + 10, p.y + 12, 2, 0, Math.PI * 2); ctx.arc(p.x + 22, p.y + 12, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(p.x + 16, p.y + 20, 6, 0.2, Math.PI - 0.2); ctx.stroke();

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [saveSession]);

  const MobileButton = ({ children, onPointerDown, onPointerUp, color = 'primary', className }: any) => (
    <motion.button
      whileTap={{ scale: 0.9, x: 2, y: 2 }}
      onPointerDown={onPointerDown}
      onPointerUp={(e) => {
        onPointerUp();
        // Prevent accidental sticky buttons
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerLeave={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "w-12 h-12 border-neo shadow-neo rounded-xl flex items-center justify-center font-black text-xl select-none touch-none",
        color === 'primary' ? "bg-primary text-black" : "bg-accent text-white",
        className
      )}
    >
      {children}
    </motion.button>
  );

  return (
    <div className={cn(
      "relative w-full border-neo shadow-neo rounded-2xl overflow-hidden bg-white group transition-all duration-500",
      "aspect-[21/9] lg:aspect-video",
      "max-lg:max-h-[280px]"
    )}>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={343} 
        className="w-full h-full block" 
        style={{ imageRendering: 'pixelated' }}
      />
      <GameHUD />
      
      {/* Mobile Controls */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end lg:hidden pointer-events-none">
        <div className="flex gap-2 pointer-events-auto items-center">
          <MobileButton 
            className="w-10 h-10 text-base"
            onPointerDown={() => keysPressed.current['arrowleft'] = true}
            onPointerUp={() => keysPressed.current['arrowleft'] = false}
          >
            ←
          </MobileButton>
          <MobileButton 
            className="w-10 h-10 text-base"
            onPointerDown={() => keysPressed.current['arrowright'] = true}
            onPointerUp={() => keysPressed.current['arrowright'] = false}
          >
            →
          </MobileButton>
        </div>
        
        <div className="pointer-events-auto">
          <MobileButton 
            color="accent"
            className="w-12 h-12 rounded-full text-sm"
            onPointerDown={() => { 
              const p = playerRef.current; 
              keysPressed.current['w'] = true;
              if (p.isGrounded) {
                p.vy = JUMP_FORCE;
                p.jumpCount = 1;
              } else if (p.jumpCount < 2) {
                p.vy = JUMP_FORCE;
                p.jumpCount = 2;
              }
            }}
            onPointerUp={() => keysPressed.current['w'] = false}
          >
            JUMP
          </MobileButton>
        </div>
      </div>
    </div>
  );
}
