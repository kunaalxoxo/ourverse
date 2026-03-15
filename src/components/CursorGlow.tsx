'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    let raf: number;
    let tx = -300, ty = -300;
    let cx = -300, cy = -300;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.transform = `translate(${cx - 240}px, ${cy - 240}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 480, height: 480,
        borderRadius: '50%',
        /* Indigo Dream: violet core fading to coral edge */
        background: 'radial-gradient(circle, rgba(176,143,232,0.06) 0%, rgba(244,149,106,0.025) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
        willChange: 'transform',
        mixBlendMode: 'screen',
      }}
    />
  );
}
