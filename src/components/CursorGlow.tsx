'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        width: 400, height: 400,
        borderRadius: '50%',
        /* Obsidian Warm: cream gold core fading to amber */
        background: 'radial-gradient(circle, rgba(232,213,176,0.07) 0%, rgba(196,154,108,0.03) 50%, transparent 72%)',
        pointerEvents: 'none',
        zIndex: 1,
        willChange: 'transform',
        transition: 'transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    />
  );
}
