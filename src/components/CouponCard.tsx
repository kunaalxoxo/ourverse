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
    /* Obsidian Warm palette */
    colors: ['#E8D5B0', '#C49A6C', '#f0e4cc', '#d4b48a', '#fff8ee'],
    zIndex: 9999,
  });
}

export default function CouponCard({ coupon, onUpdate }: { coupon: Coupon; onUpdate: () => void }) {
  const [busy, setBusy] = useState(false);
  const expired = isCouponExpired(coupon.deadline);
  const used = coupon.used;
  const dim = used || expired;

  const redeem = () => {
    setBusy(true); boom();
    setTimeout(() => { markCouponUsed(coupon.id); onUpdate(); setBusy(false); }, 700);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: dim ? 0.42 : 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card coupon-card card-interactive flex flex-col"
    >
      {dim ? <div className="accent-bar-dim" /> : <div className="accent-bar" />}

      {coupon.imageUrl && (
        <div className="w-full h-36 overflow-hidden relative">
          <img src={coupon.imageUrl} alt={coupon.name} className="w-full h-full object-cover opacity-70" style={{ transition: 'opacity 0.3s ease' }} />
          <div className="absolute inset-x-0 bottom-0 h-8" style={{ background: 'linear-gradient(to top, var(--surface), transparent)' }} />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="label">Coupon</span>
          {used && <span className="pill pill-green"><CheckCircle2 size={9} /> Redeemed</span>}
          {expired && !used && <span className="pill pill-amber"><Clock3 size={9} /> Expired</span>}
        </div>

        <h3 className="font-display text-[17px] font-medium leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>
          {coupon.name}
        </h3>
        <p className="text-[13px] leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
          {coupon.description}
        </p>

        {coupon.deadline && (
          <div className="flex items-center gap-1.5 mt-4" style={{ color: 'var(--text-faint)', fontSize: '11px' }}>
            <Calendar size={10} />
            Until {new Date(coupon.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}

        {!used && !expired && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={redeem} disabled={busy}
            className="btn-ghost mt-4 w-full justify-center"
            style={{ borderRadius: '10px' }}
          >
            {busy ? 'Redeeming…' : 'Redeem'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
