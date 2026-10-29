import React, { useEffect, useRef } from 'react';
import { AdaptiveMode } from '../types/solvespace';

interface AstraStarfieldProps {
  mode: AdaptiveMode;
  darkMode: boolean;
  motionEnabled?: boolean;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  depth: number; // 0.3 (far) .. 1.0 (near)
  tint: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
}

const MODE_AURA_DARK: Record<AdaptiveMode, { primary: string; secondary: string }> = {
  [AdaptiveMode.OnTrack]: {
    primary: 'rgba(56, 189, 248, 0.13)',
    secondary: 'rgba(99, 102, 241, 0.11)',
  },
  [AdaptiveMode.CrunchMode]: {
    primary: 'rgba(244, 63, 94, 0.15)',
    secondary: 'rgba(190, 18, 60, 0.10)',
  },
  [AdaptiveMode.BehindSchedule]: {
    primary: 'rgba(245, 158, 11, 0.14)',
    secondary: 'rgba(217, 119, 6, 0.09)',
  },
  [AdaptiveMode.RecoveryMode]: {
    primary: 'rgba(45, 212, 191, 0.14)',
    secondary: 'rgba(13, 148, 136, 0.10)',
  },
  [AdaptiveMode.AheadOfPlan]: {
    primary: 'rgba(52, 211, 153, 0.14)',
    secondary: 'rgba(16, 185, 129, 0.10)',
  },
};

const MODE_AURA_LIGHT: Record<AdaptiveMode, { primary: string; secondary: string }> = {
  [AdaptiveMode.OnTrack]: {
    primary: 'rgba(56, 189, 248, 0.12)',
    secondary: 'rgba(99, 102, 241, 0.09)',
  },
  [AdaptiveMode.CrunchMode]: {
    primary: 'rgba(244, 63, 94, 0.11)',
    secondary: 'rgba(251, 113, 133, 0.08)',
  },
  [AdaptiveMode.BehindSchedule]: {
    primary: 'rgba(245, 158, 11, 0.12)',
    secondary: 'rgba(251, 191, 36, 0.08)',
  },
  [AdaptiveMode.RecoveryMode]: {
    primary: 'rgba(20, 184, 166, 0.12)',
    secondary: 'rgba(45, 212, 191, 0.09)',
  },
  [AdaptiveMode.AheadOfPlan]: {
    primary: 'rgba(16, 185, 129, 0.12)',
    secondary: 'rgba(52, 211, 153, 0.08)',
  },
};

export const AstraStarfield: React.FC<AstraStarfieldProps> = ({
  mode,
  darkMode,
  motionEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const shouldAnimate = motionEnabled && !prefersReduced;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const darkTints = ['255, 255, 255', '186, 230, 253', '199, 210, 254', '224, 242, 254'];
    const lightTints = ['30, 64, 175', '51, 65, 85', '2, 132, 199', '79, 70, 229'];

    const starCount = Math.min(240, Math.max(110, Math.floor((width * height) / 7500)));
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => {
      const layerRoll = Math.random();
      const depth = layerRoll < 0.55 ? 0.35 : layerRoll < 0.88 ? 0.68 : 1.0;
      const speedScale = depth * 0.26;
      const palette = darkMode ? darkTints : lightTints;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: depth === 1.0 ? 1.35 + Math.random() * 0.8 : depth * (0.9 + Math.random() * 0.55),
        baseAlpha: darkMode
          ? 0.25 + depth * 0.6
          : 0.14 + depth * 0.28,
        twinkleSpeed: 0.008 + Math.random() * 0.02,
        twinklePhase: (i * 1.37) % (Math.PI * 2),
        vx: -0.14 * speedScale - Math.random() * 0.08,
        vy: -0.22 * speedScale - Math.random() * 0.12,
        depth,
        tint: palette[i % palette.length],
      };
    });

    let shootingStars: ShootingStar[] = [];
    let tick = 0;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!shouldAnimate) return;
      const nx = (e.clientX / Math.max(1, width) - 0.5) * 18;
      const ny = (e.clientY / Math.max(1, height) - 0.5) * 18;
      pointerRef.current.targetX = nx;
      pointerRef.current.targetY = ny;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const renderFrame = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer parallax easing
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.04;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.04;

      // Draw stars across 3 orbital depth planes
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (shouldAnimate) {
          s.x += s.vx;
          s.y += s.vy;
          s.twinklePhase += s.twinkleSpeed;

          if (s.x < -10) s.x = width + 10;
          if (s.x > width + 10) s.x = -10;
          if (s.y < -10) s.y = height + 10;
          if (s.y > height + 10) s.y = -10;
        }

        const parallaxX = s.x + pointerRef.current.x * s.depth;
        const parallaxY = s.y + pointerRef.current.y * s.depth;

        const twinkle = 0.72 + 0.28 * Math.sin(s.twinklePhase);
        const alpha = Math.min(1, Math.max(0.05, s.baseAlpha * twinkle));

        ctx.beginPath();
        ctx.arc(parallaxX, parallaxY, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.tint}, ${alpha.toFixed(3)})`;
        ctx.fill();

        // Subtle Astra cross-glint on the brightest foreground stars
        if (darkMode && s.depth === 1.0 && alpha > 0.68) {
          ctx.strokeStyle = `rgba(${s.tint}, ${(alpha * 0.28).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(parallaxX - s.radius * 2.6, parallaxY);
          ctx.lineTo(parallaxX + s.radius * 2.6, parallaxY);
          ctx.moveTo(parallaxX, parallaxY - s.radius * 2.6);
          ctx.lineTo(parallaxX, parallaxY + s.radius * 2.6);
          ctx.stroke();
        }
      }

      // Rare delicate Astra shooting star streak
      if (shouldAnimate && darkMode) {
        if (shootingStars.length < 1 && tick % 340 === 120 && Math.random() < 0.65) {
          shootingStars.push({
            x: Math.random() * width * 0.8 + width * 0.15,
            y: Math.random() * height * 0.35,
            vx: -5.5 - Math.random() * 2.5,
            vy: 2.6 + Math.random() * 1.6,
            length: 75 + Math.random() * 45,
            life: 0,
            maxLife: 48,
          });
        }

        shootingStars = shootingStars.filter((st) => st.life < st.maxLife);
        for (const st of shootingStars) {
          st.x += st.vx;
          st.y += st.vy;
          st.life += 1;
          const progress = st.life / st.maxLife;
          const opacity = Math.sin(progress * Math.PI) * 0.65;

          const tailX = st.x - (st.vx / 6) * st.length;
          const tailY = st.y - (st.vy / 6) * st.length;

          const grad = ctx.createLinearGradient(st.x, st.y, tailX, tailY);
          grad.addColorStop(0, `rgba(224, 242, 254, ${opacity.toFixed(3)})`);
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(st.x, st.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }

      if (shouldAnimate) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [darkMode, motionEnabled]);

  const aura = darkMode ? MODE_AURA_DARK[mode] : MODE_AURA_LIGHT[mode];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print transition-colors duration-700"
      style={{
        backgroundColor: darkMode ? '#04060D' : '#F3F6FC',
      }}
    >
      {/* Astra Horizon & Orbital Nebula Glow */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -12%, ${aura.primary}, transparent 70%),
            radial-gradient(ellipse 60% 45% at 88% 108%, ${aura.secondary}, transparent 68%),
            radial-gradient(ellipse 50% 40% at 10% 95%, rgba(56, 189, 248, 0.06), transparent 65%)
          `,
        }}
      />

      {/* Subtle Astra Orbital Horizon Arc */}
      {darkMode && (
        <div
          className="absolute -top-44 left-1/2 -translate-x-1/2 w-[140vw] h-72 rounded-[100%] border-b border-sky-400/12 opacity-70"
          style={{
            boxShadow: '0 24px 90px -12px rgba(56, 189, 248, 0.14)',
          }}
        />
      )}

      {/* Moving Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
