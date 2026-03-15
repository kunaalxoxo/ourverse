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
    <div className="flex flex-col items-center gap-3">
      {/* Tiny live indicator */}
      <span className="pulse-dot" />

      <div className="h-8 overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, filter: 'blur(4px)', y: 8 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(3px)', y: -8 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="font-serif-light text-[17px] md:text-[19px] text-white/38 text-center select-none whitespace-nowrap"
          >
            {LINES[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
