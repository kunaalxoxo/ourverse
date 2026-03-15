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
  const [user, setUser] = useState<{ displayName: string; username: string; partner: string } | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all');
  const [modal, setModal] = useState(false);

  const load = useCallback(() => {
    const u = getStoredUser();
    if (!u) { router.replace('/login'); return; }
    setUser(u);
    setCoupons(getCouponsForUser(u.username));
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

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#FFB3C6]/40 mb-3">Gifts from the heart</p>
            <h1 className="font-display text-[42px] md:text-[56px] font-medium text-white/85 leading-none mb-3" style={{ letterSpacing: '-0.02em' }}>
              Coupons
            </h1>
            <p className="text-[13px] text-white/25 font-light">
              {coupons.length === 0
                ? 'Nothing here yet — but good things are coming.'
                : `${coupons.filter(c => !c.used).length} waiting to be redeemed`}
            </p>
          </motion.div>

          {/* Filter tabs */}
          {coupons.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-2 mb-12"
            >
              {(['all', 'active', 'used'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-1.5 rounded-full text-[12px] capitalize transition-all"
                  style={{
                    background: filter === f ? 'rgba(255,179,198,0.10)' : 'transparent',
                    border: filter === f ? '1px solid rgba(255,179,198,0.20)' : '1px solid transparent',
                    color: filter === f ? 'rgba(255,179,198,0.8)' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {f}
                </button>
              ))}
            </motion.div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-white/20 text-sm">Nothing to show here.</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
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
            transition={{ delay: 0.4 }}
            className="flex justify-center mt-14"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-[13px]"
              style={{
                background: 'rgba(255,179,198,0.07)',
                border: '1px solid rgba(255,179,198,0.14)',
                color: 'rgba(255,179,198,0.7)',
              }}
            >
              <Plus size={14} /> Create a new coupon
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center border-t border-white/[0.04]">
        <p className="font-serif-light text-[13px] text-white/20">
          Every day with you is my favourite day.
        </p>
      </footer>

      {modal && user && (
        <AddCouponModal
          from={user.username}
          to={user.partner}
          onClose={() => setModal(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
