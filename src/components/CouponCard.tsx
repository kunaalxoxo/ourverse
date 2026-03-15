'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coupon, markCouponUsed, isCouponExpired } from '@/lib/coupons';
import { Calendar, CheckCircle2, Clock3 } from 'lucide-react';
import confetti from 'canvas-confetti';

function boom() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.5 },
    colors: ['#FFB3C6', '#EADCF8', '#f472b6', '#fde68a'],
    zIndex: 9999,
  });
}

export default function CouponCard({ coupon, onUpdate }: { coupon: Coupon; onUpdate: () => void }) {
  const [busy, setBusy] = useState(false);
  const expired = isCouponExpired(coupon.deadline);
  const used = coupon.used;
  const dim = used || expired;

  const redeem = () => {
    setBusy(true);
    boom();
    setTimeout(() => { markCouponUsed(coupon.id); onUpdate(); setBusy(false); }, 700);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: dim ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="coupon-card surface rounded-2xl overflow-hidden flex flex-col"
      style={{ boxShadow: dim ? 'none' : '0 4px 40px rgba(0,0,0,0.3)' }}
    >
      {/* Accent bar */}
      <div
        className="h-[3px] w-full flex-shrink-0"
        style={{
          background: dim
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(90deg, #FFB3C6 0%, #EADCF8 100%)',
        }}
      />

      {/* Optional image */}
      {coupon.imageUrl && (
        <div className="w-full h-40 overflow-hidden">
          <img src={coupon.imageUrl} alt={coupon.name} className="w-full h-full object-cover opacity-75" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#FFB3C6]/50 font-medium">Coupon</span>
          {used && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400/70">
              <CheckCircle2 size={10} /> Redeemed
            </span>
          )}
          {expired && !used && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400/60">
              <Clock3 size={10} /> Expired
            </span>
          )}
        </div>

        <h3 className="font-display text-[18px] font-medium text-white/90 leading-tight mb-2">
          {coupon.name}
        </h3>
        <p className="text-sm text-white/35 leading-relaxed flex-1">{coupon.description}</p>

        {coupon.deadline && (
          <div className="flex items-center gap-1.5 text-[11px] text-white/20 mt-4">
            <Calendar size={11} />
            Until {new Date(coupon.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}

        {!used && !expired && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={redeem}
            disabled={busy}
            className="mt-4 w-full py-2.5 rounded-xl text-[13px] font-medium transition-all"
            style={{
              background: 'rgba(255,179,198,0.08)',
              border: '1px solid rgba(255,179,198,0.18)',
              color: '#FFB3C6',
            }}
          >
            {busy ? 'Redeeming…' : 'Redeem'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
