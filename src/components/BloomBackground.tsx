'use client';
import { motion } from 'framer-motion';

export default function BloomBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <motion.div
        style={{
          position: 'absolute',
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,179,198,0.07) 0%, transparent 65%)',
          top: -200, left: -200,
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234,220,248,0.06) 0%, transparent 65%)',
          bottom: -150, right: -150,
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 320, height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,170,0.05) 0%, transparent 65%)',
          top: '45%', left: '45%',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, 50, -20, 0], y: [0, -30, 15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
    </div>
  );
}
