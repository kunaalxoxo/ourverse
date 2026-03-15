'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AFFIRMATIONS = [
  'you make everything better',
  'i choose you, every single day',
  'home is wherever you are',
  'you are my favourite adventure',
  'loving you is the easiest thing',
  'every moment with you is a gift',
  'you are enough, always',
];

export default function AffirmationCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % AFFIRMATIONS.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ height: 24, overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{    opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="font-serif-light text-center"
          style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'rgba(232,213,176,0.45)', position: 'absolute', width: '100%' }}
        >
          {AFFIRMATIONS[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
