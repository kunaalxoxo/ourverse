'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  'every day with you is my favourite',
  'you are home',
  'still falling, every single day',
  'my person, always',
  'grateful for us',
];

export default function AffirmationCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % LINES.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ height: 24, overflow: 'hidden', position: 'relative', textAlign: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.30, ease: 'easeOut' }}
          style={{ fontSize: 12, color: 'var(--text-faint)', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', letterSpacing: '0.04em', position: 'absolute', width: '100%' }}
        >{LINES[i]}</motion.p>
      </AnimatePresence>
    </div>
  );
}
