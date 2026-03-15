'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getStoredUser } from '@/lib/auth';
import { getCouponsForUser, Coupon } from '@/lib/coupons';
import BloomBackground from '@/components/BloomBackground';
import ParticleCanvas from '@/components/ParticleCanvas';
import RelationshipTimer from '@/components/RelationshipTimer';
import AffirmationCarousel from '@/components/AffirmationCarousel';
import Navbar from '@/components/Navbar';
import CouponCard from '@/components/CouponCard';
import AddCouponModal from '@/components/AddCouponModal';
import { ExternalLink, Plus, Heart } from 'lucide-react';

const PROJECTS = [
  {
    url: 'https://oneyear-black.vercel.app/',
    title: 'One Year',
    desc: 'A year of love, captured in pixels.',
    accent: 'rgba(255,179,198,0.12)',
  },
  {
    url: 'https://ily-phi-liard.vercel.app/',
    title: 'I Love You',
    desc: 'Three words, infinite meaning.',
    accent: 'rgba(234,220,248,0.12)',
  },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.65, ease: 'easeOut', delay },
  };
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string; username: string; partner: string } | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [modal, setModal] = useState(false);

  const load = () => {
    const u = getStoredUser();
    if (!u) { router.replace('/login'); return; }
    setUser(u);
    setCoupons(getCouponsForUser(u.username));
  };

  useEffect(() => { load(); }, []);

  if (!user) return null;

  const activeCoupons = coupons.filter(c => !c.used && !(new Date(c.deadline) < new Date() && c.deadline));

  return (
    <div className="relative min-h-screen">
      <ParticleCanvas />
      <BloomBackground />
      <Navbar />

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[11px] uppercase tracking-[0.3em] text-white/25 mb-8"
        >
          Since 18 November 2024
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-display text-[52px] md:text-[72px] font-medium text-white/90 text-center leading-none mb-10"
          style={{ letterSpacing: '-0.02em' }}
        >
          Our Verse
        </motion.h1>

        {/* Timer */}
        <RelationshipTimer />

        {/* Affirmation */}
        <div className="mt-10">
          <AffirmationCarousel />
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-8 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/15">scroll</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(255,179,198,0.2), transparent)' }} />
        </motion.div>
      </section>

      {/* ── Coupons ────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#FFB3C6]/40 mb-3">Waiting for you</p>
            <h2 className="font-display text-[36px] md:text-[44px] font-medium text-white/85 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Your Coupons
            </h2>
          </motion.div>

          {coupons.length === 0 ? (
            <motion.div {...fadeUp(0.1)} className="text-center py-16">
              <p className="text-white/20 text-sm font-light">Nothing here yet —</p>
              <p className="text-white/15 text-sm mt-0.5">but surprises are on their way.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.08, duration: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {coupons.map(c => (
                <CouponCard key={c.id} coupon={c} onUpdate={load} />
              ))}
            </motion.div>
          )}

          {/* Add button */}
          <motion.div {...fadeUp(0.15)} className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-[13px] transition-all"
              style={{
                background: 'rgba(255,179,198,0.08)',
                border: '1px solid rgba(255,179,198,0.16)',
                color: 'rgba(255,179,198,0.8)',
              }}
            >
              <Plus size={15} /> Create a coupon for them
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Divider ────────────────────────────────── */}
      <div className="section-divider" />

      {/* ── Creations ──────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="font-serif-light text-[13px] text-white/30 mb-3">
              Some little things I built before you.
            </p>
            <h2 className="font-display text-[32px] md:text-[40px] font-medium text-white/80 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Made with you in mind
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {PROJECTS.map((proj, i) => (
              <motion.a
                key={proj.url}
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                {...fadeUp(i * 0.12)}
                whileHover={{ scale: 1.03, y: -4 }}
                className="surface rounded-2xl p-6 block group relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 40px rgba(0,0,0,0.25)',
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
              >
                {/* Glow bg on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${proj.accent} 0%, transparent 70%)` }}
                />

                {/* Preview area */}
                <div
                  className="w-full h-28 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: proj.accent }}
                >
                  <Heart size={28} className="text-white/20 fill-white/10 group-hover:text-white/40 transition-colors" />
                </div>

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h3 className="font-display text-[17px] text-white/85 mb-1">{proj.title}</h3>
                    <p className="text-[12px] text-white/30">{proj.desc}</p>
                  </div>
                  <ExternalLink size={14} className="text-white/20 group-hover:text-white/50 mt-0.5 transition-colors flex-shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="relative z-10 py-16 text-center px-6 border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="section-divider mb-8" />
          <p className="font-serif-light text-[15px] md:text-[17px] text-white/25 max-w-sm mx-auto leading-relaxed">
            Some stories aren't written in books —<br />they're written in moments together.
          </p>
          <p className="text-[10px] text-white/10 mt-6 uppercase tracking-[0.2em]">Our Verse · {new Date().getFullYear()}</p>
        </motion.div>
      </footer>

      {/* Modal */}
      {modal && (
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
