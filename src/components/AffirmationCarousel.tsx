'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  'One more day with you.',
  'Our little universe.',
  'Built on laughter.',
  'Still choosing you.',
  'A story still being written.',
  'Every moment, a favourite.',
  'Home is wherever you are.',
  'In every version, you.',
];

export default function AffirmationCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % LINES.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-9 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-serif-light text-lg md:text-xl text-white/45 text-center select-none"
        >
          {LINES[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
