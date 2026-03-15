'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const START = new Date('2024-11-18T00:00:00');

function diff() {
  const ms = Date.now() - START.getTime();
  return {
    days:    Math.floor(ms / 86400000),
    hours:   Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

export default function RelationshipTimer() {
  const [t, setT] = useState(diff);
  useEffect(() => { const id = setInterval(() => setT(diff()), 1000); return () => clearInterval(id); }, []);

  const units = [
    { label: 'days', value: t.days },
    { label: 'hours', value: t.hours },
    { label: 'mins', value: t.minutes },
    { label: 'secs', value: t.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-6">
      {units.map((u, i) => (
        <motion.div
          key={u.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Number */}
          <div
            className="relative flex items-center justify-center rounded-2xl"
            style={{
              width: 72, height: 68,
              background: '#1A1A22',
              border: '1px solid rgba(255,179,198,0.10)',
              boxShadow: '0 0 24px rgba(255,179,198,0.05)',
            }}
          >
            <motion.span
              key={u.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-display text-3xl font-medium text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              {String(u.value).padStart(2, '0')}
            </motion.span>
          </div>
          <span className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/25 font-medium">
            {u.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
