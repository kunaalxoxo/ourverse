'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const START_DATE = new Date('2024-11-18T00:00:00');

function getTimeDiff() {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export default function RelationshipTimer() {
  const [time, setTime] = useState(getTimeDiff());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeDiff()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {units.map((unit, i) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
          className="glass-card rounded-2xl px-6 py-5 text-center min-w-[90px]"
          style={{
            background: 'rgba(255,255,255,0.04)',
            boxShadow: '0 0 20px rgba(244,114,182,0.08)',
          }}
        >
          <motion.div
            key={unit.value}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="font-display text-4xl md:text-5xl font-light text-white glow-text"
          >
            {String(unit.value).padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-pink-300/60 mt-1 uppercase tracking-widest font-medium">
            {unit.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
