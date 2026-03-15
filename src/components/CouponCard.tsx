'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coupon, markCouponUsed, isCouponExpired } from '@/lib/coupons';
import { Calendar, CheckCircle, Clock, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors: ['#f472b6', '#e879f9', '#a78bfa', '#fb7185', '#fde68a'],
    zIndex: 9999,
  });
}

interface Props {
  coupon: Coupon;
  onUpdate: () => void;
}

export default function CouponCard({ coupon, onUpdate }: Props) {
  const [isUsing, setIsUsing] = useState(false);
  const expired = isCouponExpired(coupon.deadline);
  const used = coupon.used;

  const handleUse = () => {
    setIsUsing(true);
    fireConfetti();
    setTimeout(() => {
      markCouponUsed(coupon.id);
      onUpdate();
      setIsUsing(false);
    }, 800);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: used || expired ? 0.5 : 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={!used && !expired ? { scale: 1.03, y: -4 } : {}}
      className="coupon-card glass-card rounded-2xl overflow-hidden relative group cursor-default transition-all duration-300"
      style={{
        background: used
          ? 'rgba(255,255,255,0.02)'
          : 'rgba(255,255,255,0.04)',
      }}
    >
      {/* Top gradient strip */}
      <div
        className="h-1.5 w-full"
        style={{
          background: used
            ? 'rgba(255,255,255,0.1)'
            : 'linear-gradient(90deg, #f472b6, #a855f7)',
        }}
      />

      {/* Image */}
      {coupon.imageUrl && (
        <div className="w-full h-36 overflow-hidden">
          <img
            src={coupon.imageUrl}
            alt={coupon.name}
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      )}

      <div className="p-5">
        {/* Used badge */}
        {used && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-full">
            <CheckCircle size={10} /> Used
          </div>
        )}
        {expired && !used && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs px-2 py-1 rounded-full">
            <Clock size={10} /> Expired
          </div>
        )}

        <div className="mb-1 text-xs text-pink-400/60 uppercase tracking-widest">Coupon</div>
        <h3 className="font-display text-xl font-medium text-white mb-2">{coupon.name}</h3>
        <p className="text-sm text-white/50 leading-relaxed mb-4">{coupon.description}</p>

        {coupon.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-white/30 mb-4">
            <Calendar size={12} />
            Valid until {new Date(coupon.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}

        {!used && !expired && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleUse}
            disabled={isUsing}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(168,85,247,0.2))',
              border: '1px solid rgba(244,114,182,0.3)',
              color: '#f9a8d4',
            }}
          >
            {isUsing ? '✨ Redeeming...' : '🎁 Redeem Coupon'}
          </motion.button>
        )}
      </div>

      {/* Glow on hover */}
      {!used && !expired && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(244,114,182,0.05) 0%, transparent 70%)',
          }}
        />
      )}
    </motion.div>
  );
}
