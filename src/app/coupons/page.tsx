'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser } from '@/lib/auth';
import { getCouponsForUser, Coupon } from '@/lib/coupons';
import BloomBackground from '@/components/BloomBackground';
import Navbar from '@/components/Navbar';
import CouponCard from '@/components/CouponCard';
import AddCouponModal from '@/components/AddCouponModal';
import CursorGlow from '@/components/CursorGlow';
import MarqueeStrip from '@/components/MarqueeStrip';
import { Plus } from 'lucide-react';

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.50, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
  };
}

function SectionLine() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.25 }}
      style={{ originX: 0.5 }} className="section-line"
    />
  );
}

export default function CouponsPage() {
  const router = useRouter();
  const [user, setUser]       = useState<{ displayName: string; username: string; partner: string } | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<'all' | 'active' | 'used'>('all');
  const [modal, setModal]     = useState(false);

  const load = useCallback(async () => {
    const u = getStoredUser();
    if (!u) { router.replace('/login'); return; }
    setUser(u); setLoading(true);
    const data = await getCouponsForUser(u.username);
    setCoupons(data); setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const filtered = coupons.filter(c =>
    filter === 'used' ? c.used : filter === 'active' ? !c.used : true
  );

  if (!user || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.8, repeat: Infinity }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(200,184,240,0.10)' }} />
      </motion.div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <CursorGlow />
      <BloomBackground />
      <Navbar />

      <main className="relative z-10 pt-32 pb-0 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...reveal()} className="mb-6">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="label mb-3 block">Gifts from the heart</span>
                <h1 className="section-heading">Your Coupons</h1>
              </div>
              <span className="section-index">02</span>
            </div>
            <SectionLine />
          </motion.div>

          <motion.p {...reveal(0.12)} className="mt-6 mb-10" style={{ fontSize: 13, color: 'var(--text-faint)' }}>
            {coupons.length === 0 ? 'Nothing here yet — good things are coming.' : `${coupons.filter(c => !c.used).length} waiting to be redeemed`}
          </motion.p>

          {coupons.length > 0 && (
            <motion.div {...reveal(0.18)} className="flex gap-2 mb-12">
              {(['all', 'active', 'used'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="relative px-4 py-1.5 text-[12px] capitalize rounded-full transition-colors duration-200"
                  style={{ color: filter === f ? 'rgba(200,184,240,0.92)' : 'var(--text-faint)' }}
                >
                  {filter === f && (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full"
                      style={{ background: 'rgba(200,184,240,0.08)', border: '1px solid rgba(200,184,240,0.20)' }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              ))}
            </motion.div>
          )}

          {filtered.length === 0 ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center" style={{ fontSize: 13, color: 'var(--text-faint)' }}>Nothing to show here.</motion.p>
          ) : (
            <motion.div
              layout initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
              className="coupon-grid"
            >
              <AnimatePresence>
                {filtered.map((c, i) => (
                  <motion.div key={c.id} layout
                    variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.40 } } }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
                    className="relative"
                    style={{ willChange: 'opacity, transform' }}
                  >
                    <span className="coupon-index">{String(i + 1).padStart(2, '0')}</span>
                    <CouponCard coupon={c} onUpdate={load} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          <motion.div {...reveal(0.25)} className="flex justify-center mt-14 mb-0">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setModal(true)} className="btn-ghost">
              <Plus size={13} /> Create a coupon for them
            </motion.button>
          </motion.div>
        </div>
      </main>

      <div className="relative z-10 mt-20"><MarqueeStrip /></div>

      <footer className="relative z-10 py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.35 }} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <p className="font-serif-light" style={{ fontSize: 'clamp(18px, 3vw, 26px)', color: 'rgba(242,240,255,0.22)' }}>Every day with you is my favourite day.</p>
            <div className="text-right">
              <p className="label mb-1">Our Verse</p>
              <p className="label" style={{ color: 'var(--text-faint)' }}>{new Date().getFullYear()}</p>
            </div>
          </motion.div>
        </div>
      </footer>

      {modal && user && (
        <AddCouponModal from={user.username} to={user.partner} onClose={() => setModal(false)} onCreated={load} />
      )}
    </div>
  );
}
