'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AFFIRMATIONS = [
  'Every day with you feels like magic ✨',
  'Our little universe 🌙',
  'Still falling for you 💗',
  'Built on love and silly moments',
  'Two people, one story 💫',
  '1 year full of joy',
  'You are my favorite adventure 🌸',
  'In every version of the universe, I choose you',
  'Home is wherever you are 🏡',
  'My favorite hello and my hardest goodbye',
];

export default function AffirmationCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-12 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-script text-2xl md:text-3xl text-pink-200/80 text-center px-4"
        >
          {AFFIRMATIONS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
