"use client"
import { useEffect, useRef, useCallback } from 'react';

const AnimatedBackground: React.FC<{ className?: string }> = ({ className }) => {
  const interBubbleRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const throttleDelay = 16; // ~60fps

  const move = useCallback(() => {
    const interBubble = interBubbleRef.current;
    if (!interBubble) return;

    const now = performance.now();
    if (now - lastTimeRef.current < throttleDelay) {
      animationFrameRef.current = requestAnimationFrame(move);
      return;
    }
    lastTimeRef.current = now;

    const { curX, curY, tgX, tgY } = interBubble.dataset;
    const newCurX = parseFloat(curX || '0') + (parseFloat(tgX || '0') - parseFloat(curX || '0')) / 20;
    const newCurY = parseFloat(curY || '0') + (parseFloat(tgY || '0') - parseFloat(curY || '0')) / 20;

    interBubble.dataset.curX = newCurX.toString();
    interBubble.dataset.curY = newCurY.toString();
    interBubble.style.transform = `translate3d(${Math.round(newCurX)}px, ${Math.round(newCurY)}px, 0)`;
    
    animationFrameRef.current = requestAnimationFrame(move);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const interBubble = interBubbleRef.current;
    if (!interBubble) return;

    interBubble.dataset.tgX = event.clientX.toString();
    interBubble.dataset.tgY = event.clientY.toString();
  }, []);

  useEffect(() => {
    const interBubble = interBubbleRef.current;
    if (!interBubble) return;

    // Initialize position data
    interBubble.dataset.curX = '0';
    interBubble.dataset.curY = '0';
    interBubble.dataset.tgX = '0';
    interBubble.dataset.tgY = '0';

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(move);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, move]);

  return (
    <div className={`gradient-bg -z-10 ${className}`}>
      {/* SVG with the goo filter definition */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="gradients-container">
        <div className="g1" />
        <div className="g2" />
        <div className="g3" />
        <div className="g4" />
        <div className="g5" />
        <div ref={interBubbleRef} className="interactive" />
      </div>

      {/* Custom CSS inlined via styled-jsx */}
      <style jsx global>{`
        :root {
          --color-bg1: rgb(108, 0, 162);
          --color-bg2: rgb(0, 17, 82);
          --color1: 18, 113, 255;
          --color2: 221, 74, 255;
          --color3: 100, 220, 255;
          --color4: 200, 50, 50;
          --color5: 180, 180, 50;
          --color-interactive: 140, 100, 255;
          --circle-size: 80%;
          --blending: hard-light;
        }

        /* Keyframes */
        @keyframes moveInCircle {
          0% {
            transform: rotate(0deg) translateZ(0);
          }
          50% {
            transform: rotate(180deg) translateZ(0);
          }
          100% {
            transform: rotate(360deg) translateZ(0);
          }
        }
        @keyframes moveVertical {
          0% {
            transform: translateY(-50%) translateZ(0);
          }
          50% {
            transform: translateY(50%) translateZ(0);
          }
          100% {
            transform: translateY(-50%) translateZ(0);
          }
        }
        @keyframes moveHorizontal {
          0% {
            transform: translateX(-50%) translateY(-10%) translateZ(0);
          }
          50% {
            transform: translateX(50%) translateY(10%) translateZ(0);
          }
          100% {
            transform: translateX(-50%) translateY(-10%) translateZ(0);
          }
        }

        /* Main container */
        .gradient-bg {
          overflow: hidden;
          background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
          will-change: transform;
          transform: translateZ(0);
        }

        .gradient-bg svg {
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
        }

        /* Gradient bubbles container */
        .gradients-container {
          filter: url(#goo) blur(40px);
          width: 100%;
          height: 100%;
          will-change: transform;
          transform: translateZ(0);
        }

        /* Individual animated bubbles */
        .g1, .g2, .g3, .g4, .g5, .interactive {
          position: absolute;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .g1 {
          background: radial-gradient(
            circle at center,
            rgba(var(--color1), 0.8) 0,
            rgba(var(--color1), 0) 50%
          ) no-repeat;
          mix-blend-mode: var(--blending);
          width: var(--circle-size);
          height: var(--circle-size);
          top: calc(50% - var(--circle-size) / 2);
          left: calc(50% - var(--circle-size) / 2);
          transform-origin: center center;
          animation: moveVertical 30s ease infinite;
          opacity: 1;
        }

        .g2 {
          background: radial-gradient(
            circle at center,
            rgba(var(--color2), 0.8) 0,
            rgba(var(--color2), 0) 50%
          ) no-repeat;
          mix-blend-mode: var(--blending);
          width: var(--circle-size);
          height: var(--circle-size);
          top: calc(50% - var(--circle-size) / 2);
          left: calc(50% - var(--circle-size) / 2);
          transform-origin: calc(50% - 400px);
          animation: moveInCircle 20s reverse infinite;
          opacity: 1;
        }

        .g3 {
          background: radial-gradient(
            circle at center,
            rgba(var(--color3), 0.8) 0,
            rgba(var(--color3), 0) 50%
          ) no-repeat;
          mix-blend-mode: var(--blending);
          width: var(--circle-size);
          height: var(--circle-size);
          top: calc(50% - var(--circle-size) / 2 + 200px);
          left: calc(50% - var(--circle-size) / 2 - 500px);
          transform-origin: calc(50% + 400px);
          animation: moveInCircle 40s linear infinite;
          opacity: 1;
        }

        .g4 {
          background: radial-gradient(
            circle at center,
            rgba(var(--color4), 0.8) 0,
            rgba(var(--color4), 0) 50%
          ) no-repeat;
          mix-blend-mode: var(--blending);
          width: var(--circle-size);
          height: var(--circle-size);
          top: calc(50% - var(--circle-size) / 2);
          left: calc(50% - var(--circle-size) / 2);
          transform-origin: calc(50% - 200px);
          animation: moveHorizontal 40s ease infinite;
          opacity: 0.7;
        }

        .g5 {
          background: radial-gradient(
            circle at center,
            rgba(var(--color5), 0.8) 0,
            rgba(var(--color5), 0) 50%
          ) no-repeat;
          mix-blend-mode: var(--blending);
          width: calc(var(--circle-size) * 2);
          height: calc(var(--circle-size) * 2);
          top: calc(50% - var(--circle-size));
          left: calc(50% - var(--circle-size));
          transform-origin: calc(50% - 800px) calc(50% + 200px);
          animation: moveInCircle 20s ease infinite;
          opacity: 1;
        }

        /* Interactive bubble that follows the mouse */
        .interactive {
          background: radial-gradient(
            circle at center,
            rgba(var(--color-interactive), 0.8) 0,
            rgba(var(--color-interactive), 0) 50%
          ) no-repeat;
          mix-blend-mode: var(--blending);
          width: 100%;
          height: 100%;
          top: -50%;
          left: -50%;
          opacity: 0.7;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
