'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    let raf: number;
    let tx = -200, ty = -200;
    let cx = -200, cy = -200;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,179,198,0.055) 0%, rgba(234,220,248,0.025) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
        willChange: 'transform',
        mixBlendMode: 'screen',
      }}
    />
  );
}
