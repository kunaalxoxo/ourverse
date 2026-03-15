'use client';
import { motion } from 'framer-motion';

export default function BloomBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
      {/* Large warm orb — top left */}
      <motion.div
        style={{
          position: 'absolute',
          width: 640, height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,179,198,0.065) 0%, transparent 68%)',
          top: -180, left: -180,
          filter: 'blur(48px)',
        }}
        animate={{ x: [0, 36, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Lavender orb — bottom right */}
      <motion.div
        style={{
          position: 'absolute',
          width: 480, height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234,220,248,0.055) 0%, transparent 68%)',
          bottom: -140, right: -140,
          filter: 'blur(48px)',
        }}
        animate={{ x: [0, -26, 0], y: [0, -18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      {/* Accent mid orb */}
      <motion.div
        style={{
          position: 'absolute',
          width: 260, height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,170,0.04) 0%, transparent 68%)',
          top: '48%', left: '42%',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 44, -16, 0], y: [0, -24, 14, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
      />
    </div>
  );
}
