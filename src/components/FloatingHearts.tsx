'use client';
import { motion } from 'framer-motion';

export default function FloatingHearts() {
  const hearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 6,
    size: 10 + Math.random() * 14,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-pink-400"
          style={{
            left: `${h.x}%`,
            bottom: '-50px',
            fontSize: `${h.size}px`,
            opacity: h.opacity,
          }}
          animate={{ y: [0, -window.innerHeight - 100], opacity: [h.opacity, 0] }}
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
