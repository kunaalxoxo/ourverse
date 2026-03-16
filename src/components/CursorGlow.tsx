'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top  = `${e.clientY}px`;
    };
    document.addEventListener('mousemove', move);
    return () => document.removeEventListener('mousemove', move);
  }, []);

  return (
    <div ref={ref} aria-hidden style={{
      position: 'fixed', pointerEvents: 'none', zIndex: 1,
      width: 380, height: 380, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(201,123,132,0.28) 0%, rgba(201,123,132,0.10) 40%, transparent 70%)',
      transform: 'translate(-50%, -50%)',
      transition: 'left 0.10s ease, top 0.10s ease',
    }} />
  );
}
