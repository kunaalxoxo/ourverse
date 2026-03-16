'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coupon, markCouponUsed, isCouponExpired } from '@/lib/coupons';
import { Calendar, CheckCircle2, Clock3 } from 'lucide-react';
import confetti from 'canvas-confetti';

function boom() {
  confetti({
    particleCount: 70, spread: 60, origin: { y: 0.5 },
    colors: ['#C97B84', '#f0b8bc', '#f7e0e2', '#ffffff'],
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: dim ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.28 }}
      style={{ willChange: 'opacity, transform' }}
      className="card coupon-card card-interactive flex flex-col"
    >
      {dim ? <div className="accent-bar-dim" /> : <div className="accent-bar" />}

      {coupon.image_url && (
        <div style={{ width: '100%', height: 120, overflow: 'hidden' }}>
          <img src={coupon.image_url} alt={coupon.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.80 }}
          />
        </div>
      )}

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="label">Coupon</span>
          {used    && <span className="pill pill-green"><CheckCircle2 size={8} /> Redeemed</span>}
          {expired && !used && <span className="pill pill-amber"><Clock3 size={8} /> Expired</span>}
        </div>

        <h3 className="font-display" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3, marginBottom: 6, color: 'var(--text-primary)' }}>
          {coupon.name}
        </h3>
        <p style={{ fontSize: 12.5, lineHeight: 1.6, flex: 1, color: 'var(--text-muted)' }}>
          {coupon.description}
        </p>

        {coupon.deadline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 14, color: 'var(--text-faint)', fontSize: 11 }}>
            <Calendar size={9} />
            Until {new Date(coupon.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}

        {!used && !expired && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={redeem} disabled={busy}
            className="btn-ghost"
            style={{ marginTop: 14, width: '100%', justifyContent: 'center', borderRadius: 8, fontSize: 12 }}
          >
            {busy ? 'Redeeming…' : 'Redeem'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
