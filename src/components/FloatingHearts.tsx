'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function FloatingHearts() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const hearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 6,
    size: 10 + Math.random() * 14,
    opacity: 0.10 + Math.random() * 0.15,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          style={{
            position: 'absolute',
            left: `${h.x}%`,
            bottom: -50,
            fontSize: h.size,
            opacity: h.opacity,
            color: 'var(--accent)',
          }}
          animate={{ y: -(window.innerHeight + 100), opacity: 0 }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}
