'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coupon, markCouponUsed, isCouponExpired } from '@/lib/coupons';
import { Calendar, CheckCircle2, Clock3 } from 'lucide-react';
import confetti from 'canvas-confetti';

function boom() {
  confetti({
    particleCount: 80, spread: 65, origin: { y: 0.5 },
    colors: ['#C9897A', '#e8b4a8', '#f0d4cc', '#ffffff'],
    zIndex: 9999,
  });
}

export default function CouponCard({ coupon, onUpdate }: { coupon: Coupon; onUpdate: () => void }) {
  const [busy, setBusy] = useState(false);
  const expired = isCouponExpired(coupon.deadline);
  const used    = coupon.used;
  const dim     = used || expired;

  const redeem = async () => {
    setBusy(true); boom();
    await markCouponUsed(coupon.id);
    onUpdate();
    setBusy(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: dim ? 0.40 : 1, y: 0 }}
      transition={{ duration: 0.30 }}
      style={{ willChange: 'opacity, transform' }}
      className="card coupon-card card-interactive flex flex-col"
    >
      {dim ? <div className="accent-bar-dim" /> : <div className="accent-bar" />}

      {coupon.image_url && (
        <div className="w-full h-32 overflow-hidden">
          <img src={coupon.image_url} alt={coupon.name} className="w-full h-full object-cover" style={{ opacity: 0.65 }} />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="label">Coupon</span>
          {used    && <span className="pill pill-green"><CheckCircle2 size={8} /> Redeemed</span>}
          {expired && !used && <span className="pill pill-amber"><Clock3 size={8} /> Expired</span>}
        </div>

        <h3 className="font-display text-[16px] font-medium leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>
          {coupon.name}
        </h3>
        <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
          {coupon.description}
        </p>

        {coupon.deadline && (
          <div className="flex items-center gap-1.5 mt-4" style={{ color: 'var(--text-faint)', fontSize: '11px' }}>
            <Calendar size={9} />
            Until {new Date(coupon.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}

        {!used && !expired && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={redeem} disabled={busy}
            className="btn-ghost mt-4 w-full justify-center"
            style={{ borderRadius: '8px', fontSize: '12px' }}
          >
            {busy ? 'Redeeming…' : 'Redeem'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
