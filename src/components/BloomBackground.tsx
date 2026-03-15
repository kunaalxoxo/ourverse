'use client';
import { motion } from 'framer-motion';

export default function BloomBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main bloom orbs */}
      <motion.div
        className="bloom-orb"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)',
          top: '-100px',
          left: '-100px',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bloom-orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
          bottom: '-80px',
          right: '-80px',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="bloom-orb"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(251,113,133,0.08) 0%, transparent 70%)',
          top: '40%',
          left: '30%',
        }}
        animate={{
          x: [0, 60, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <motion.div
        className="bloom-orb"
        style={{
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.09) 0%, transparent 70%)',
          top: '10%',
          right: '20%',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  );
}
