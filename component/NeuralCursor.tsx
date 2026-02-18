
import React, { useState, useEffect, useRef } from 'react';

const NeuralCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailingPos, setTrailingPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const requestRef = useRef<number>();

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, .cursor-pointer, .premium-trigger')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const animateTrailing = () => {
      setTrailingPos(prev => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15
      }));
      requestRef.current = requestAnimationFrame(animateTrailing);
    };
    requestRef.current = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position]);

  return (
    <>
      <style>{`
        .neural-node-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          background-color: #EAB308;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px #EAB308;
        }
        .neural-node-aura {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, transparent 70%);
          border: 1px solid rgba(234, 179, 8, 0.2);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      height 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      background-color 0.4s ease, 
                      border 0.4s ease;
        }
        .cursor-active .neural-node-aura {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(234, 179, 8, 0.25) 0%, transparent 80%);
          border: 1px solid rgba(234, 179, 8, 0.5);
          backdrop-filter: blur(2px);
        }
        .cursor-clicked .neural-node-aura {
          transform: translate(-50%, -50%) scale(0.85);
        }
        .neural-trail {
          position: fixed;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(234, 179, 8, 0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
        }
        @media (max-width: 768px) {
          .neural-node-dot, .neural-node-aura, .neural-trail { display: none; }
        }
      `}</style>
      <div className={`cursor-container ${isHovering ? 'cursor-active' : ''} ${isClicked ? 'cursor-clicked' : ''}`}>
        <div 
          className="neural-node-dot" 
          style={{ left: `${position.x}px`, top: `${position.y}px` }} 
        />
        <div 
          className="neural-node-aura" 
          style={{ left: `${position.x}px`, top: `${position.y}px` }} 
        />
        <div 
          className="neural-trail" 
          style={{ left: `${trailingPos.x}px`, top: `${trailingPos.y}px` }} 
        />
      </div>
    </>
  );
};

export default NeuralCursor;
