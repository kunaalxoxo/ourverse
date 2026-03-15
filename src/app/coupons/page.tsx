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
import { Gift, PlusCircle, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function CouponsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string; username: string } | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all');

  const loadCoupons = useCallback(() => {
    const u = getStoredUser();
    if (!u) return;
    setCoupons(getCouponsForUser(u.username));
  }, []);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) router.replace('/login');
    else {
      setUser(u);
      loadCoupons();
    }
  }, [router, loadCoupons]);

  const filtered = coupons.filter((c) => {
    if (filter === 'used') return c.used;
    if (filter === 'active') return !c.used;
    return true;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
      <ParticleCanvas />
      <BloomBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-pink-300/60 text-xs uppercase tracking-widest mb-2">Gifts from the heart</p>
          <h1 className="font-display text-4xl md:text-6xl text-white glow-text mb-2">Your Coupons</h1>
          <p className="text-white/30 text-sm">
            {coupons.length === 0
              ? 'No coupons yet — but good things are coming 🌸'
              : `${coupons.filter((c) => !c.used).length} waiting to be redeemed`}
          </p>
        </motion.div>

        {/* Filters */}
        {coupons.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 mb-10"
          >
            {(['all', 'active', 'used'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm capitalize transition-all ${
                  filter === f
                    ? 'text-pink-300'
                    : 'text-white/30 hover:text-white/60'
                }`}
                style={{
                  background: filter === f ? 'rgba(244,114,182,0.15)' : 'transparent',
                  border: filter === f ? '1px solid rgba(244,114,182,0.3)' : '1px solid transparent',
                }}
              >
                {f}
              </button>
            ))}
          </motion.div>
        )}

        {/* Coupons Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white/30 mb-6">
              {filter === 'used' ? 'No used coupons yet.' : 'Nothing here yet...'}
            </p>
            <Link
              href="/add-coupon"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(244,114,182,0.15)',
                border: '1px solid rgba(244,114,182,0.25)',
                color: '#f9a8d4',
              }}
            >
              <PlusCircle size={16} /> Create one for them instead
            </Link>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filtered.map((coupon, i) => (
                <motion.div
                  key={coupon.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <CouponCard coupon={coupon} onUpdate={loadCoupons} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 text-center px-6 border-t border-white/5">
        <p className="font-script text-base text-white/25">
          Every day with you is my favorite day.
        </p>
      </footer>
    </div>
  );
}
