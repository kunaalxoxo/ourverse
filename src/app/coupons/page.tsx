'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser } from '@/lib/auth';
import { getCouponsForUser, Coupon } from '@/lib/coupons';
import BloomBackground from '@/components/BloomBackground';
import ParticleCanvas from '@/components/ParticleCanvas';
import Navbar from '@/components/Navbar';
import CouponCard from '@/components/CouponCard';
import AddCouponModal from '@/components/AddCouponModal';
import { Plus } from 'lucide-react';

export default function CouponsPage() {
  const router = useRouter();
  const [user, setUser]     = useState<{ displayName: string; username: string; partner: string } | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all');
  const [modal, setModal]   = useState(false);

  const load = useCallback(() => {
    const u = getStoredUser();
    if (!u) { router.replace('/login'); return; }
    setUser(u); setCoupons(getCouponsForUser(u.username));
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const filtered = coupons.filter(c =>
    filter === 'used' ? c.used : filter === 'active' ? !c.used : true
  );

  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      <ParticleCanvas />
      <BloomBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-28 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <span className="label">Gifts from the heart</span>
            <h1
              className="font-display font-medium text-white/87 mt-3"
              style={{ fontSize: 'clamp(36px, 8vw, 54px)', letterSpacing: '-0.025em', lineHeight: 1.05 }}
            >
              Coupons
            </h1>
            <p className="text-[13px] mt-3" style={{ color: 'var(--text-faint)' }}>
              {coupons.length === 0
                ? 'Nothing here yet — good things are coming.'
                : `${coupons.filter(c => !c.used).length} waiting to be redeemed`}
            </p>
          </motion.div>

          {/* Filter pills */}
          {coupons.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex justify-center gap-2 mb-14"
            >
              {(['all', 'active', 'used'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="relative px-4 py-1.5 text-[12px] capitalize rounded-full transition-colors duration-300"
                  style={{ color: filter === f ? 'rgba(255,179,198,0.85)' : 'var(--text-faint)' }}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'rgba(255,179,198,0.09)', border: '1px solid rgba(255,179,198,0.18)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-[13px]"
              style={{ color: 'var(--text-faint)' }}
            >
              Nothing to show here.
            </motion.p>
          ) : (
            <motion.div
              layout
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {filtered.map(c => (
                  <motion.div
                    key={c.id} layout
                    variants={{
                      hidden:  { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <CouponCard coupon={c} onUpdate={load} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Add */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center mt-14"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModal(true)}
              className="btn-ghost"
            >
              <Plus size={14} /> Create a new coupon
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-14 text-center border-t border-white/[0.035]">
        <p className="font-serif-light text-[13px]" style={{ color: 'var(--text-faint)' }}>
          Every day with you is my favourite day.
        </p>
      </footer>

      {modal && user && (
        <AddCouponModal
          from={user.username} to={user.partner}
          onClose={() => setModal(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
