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

function Digit({ value, label, delay }: { value: number; label: string; delay: number }) {
  const str = String(value).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: 'easeOut' }}
      className="flex flex-col items-center"
    >
      <div
        className="relative overflow-hidden rounded-xl flex items-center justify-center"
        style={{
          width: 68, height: 64,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Subtle inner glow top */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,179,198,0.2), transparent)' }}
        />

        <motion.span
          key={str}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="font-display text-[28px] font-medium text-white/88"
          style={{ letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          {str}
        </motion.span>
      </div>
      <span className="label mt-2.5">{label}</span>
    </motion.div>
  );
}

export default function RelationshipTimer() {
  const [t, setT] = useState(diff);
  useEffect(() => { const id = setInterval(() => setT(diff()), 1000); return () => clearInterval(id); }, []);

  const units = [
    { label: 'days',  value: t.days },
    { label: 'hours', value: t.hours },
    { label: 'mins',  value: t.minutes },
    { label: 'secs',  value: t.seconds },
  ];

  return (
    <div className="flex items-end gap-3 md:gap-5 justify-center">
      {units.map((u, i) => (
        <Digit key={u.label} value={u.value} label={u.label} delay={0.45 + i * 0.08} />
      ))}
    </div>
  );
}
