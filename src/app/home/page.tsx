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
    url:    'https://oneyear-black.vercel.app/',
    title:  'One Year',
    desc:   'A year of love, captured in pixels.',
    color:  'rgba(255,179,198,0.10)',
  },
  {
    url:    'https://ily-phi-liard.vercel.app/',
    title:  'I Love You',
    desc:   'Three words, infinite meaning.',
    color:  'rgba(234,220,248,0.10)',
  },
];

/* Reusable scroll-reveal props */
function reveal(delay = 0, yOffset = 24) {
  return {
    initial: { opacity: 0, y: yOffset },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-56px' },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
  };
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser]     = useState<{ displayName: string; username: string; partner: string } | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [modal, setModal]   = useState(false);

  const load = () => {
    const u = getStoredUser();
    if (!u) { router.replace('/login'); return; }
    setUser(u);
    setCoupons(getCouponsForUser(u.username));
  };

  useEffect(() => { load(); }, []);
  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      <ParticleCanvas />
      <BloomBackground />
      <Navbar />

      {/* ─── HERO ───────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 pb-24">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="flex items-center gap-2 mb-9"
        >
          <div className="section-divider" style={{ width: 20 }} />
          <span className="label">Since 18 November 2024</span>
          <div className="section-divider" style={{ width: 20 }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display font-medium text-center text-white/90 mb-11"
          style={{ fontSize: 'clamp(48px, 10vw, 78px)', letterSpacing: '-0.025em', lineHeight: 1.05 }}
        >
          Our Verse
        </motion.h1>

        {/* Timer */}
        <RelationshipTimer />

        {/* Affirmation */}
        <div className="mt-10">
          <AffirmationCarousel />
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 5, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="label" style={{ letterSpacing: '0.25em' }}>scroll</span>
          <motion.div
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-7 origin-top"
            style={{ background: 'linear-gradient(to bottom, rgba(255,179,198,0.25), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ─── COUPONS ───────────────────────────── */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-3xl mx-auto">

          <motion.div {...reveal()} className="text-center mb-16">
            <span className="label">Waiting for you</span>
            <h2
              className="font-display font-medium mt-3 text-white/85"
              style={{ fontSize: 'clamp(30px, 6vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
            >
              Your Coupons
            </h2>
          </motion.div>

          {coupons.length === 0 ? (
            <motion.div {...reveal(0.1)} className="text-center py-14">
              <p style={{ color: 'var(--text-faint)', fontSize: 13 }}>
                Nothing here yet — but good things are coming.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {coupons.map(c => (
                <motion.div
                  key={c.id}
                  variants={{
                    hidden:   { opacity: 0, y: 22 },
                    visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
                  }}
                >
                  <CouponCard coupon={c} onUpdate={load} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA */}
          <motion.div {...reveal(0.12)} className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModal(true)}
              className="btn-ghost"
            >
              <Plus size={14} /> Create a coupon for them
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── DIVIDER ────────────────────────────── */}
      <div className="section-divider" />

      {/* ─── CREATIONS ─────────────────────────── */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-2xl mx-auto">

          <motion.div {...reveal()} className="text-center mb-16">
            <p className="font-serif-light text-[14px] mb-3" style={{ color: 'var(--text-muted)' }}>
              Some little things I built before you.
            </p>
            <h2
              className="font-display font-medium text-white/82"
              style={{ fontSize: 'clamp(26px, 5vw, 38px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
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
                {...reveal(i * 0.1)}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.99 }}
                className="card card-interactive block group p-6 relative overflow-hidden"
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${proj.color} 0%, transparent 70%)` }}
                />

                {/* Preview */}
                <div
                  className="w-full h-28 rounded-xl mb-5 flex items-center justify-center relative z-10"
                  style={{ background: proj.color }}
                >
                  <Heart size={24}
                    className="text-white/20 fill-white/10 group-hover:text-white/38 transition-colors duration-400" />
                </div>

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h3 className="font-display text-[16px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      {proj.title}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{proj.desc}</p>
                  </div>
                  <ExternalLink size={13}
                    className="text-white/18 group-hover:text-white/50 mt-0.5 flex-shrink-0 transition-colors duration-300" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────── */}
      <footer className="relative z-10 py-20 text-center px-6 border-t border-white/[0.035]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="section-divider mb-9" />
          <p className="font-serif-light text-[16px] md:text-[18px] max-w-xs mx-auto leading-relaxed"
            style={{ color: 'var(--text-faint)' }}>
            Some stories aren’t written in books —<br />they’re written in moments together.
          </p>
          <p className="label mt-7">Our Verse · {new Date().getFullYear()}</p>
        </motion.div>
      </footer>

      {/* Modal */}
      {modal && (
        <AddCouponModal
          from={user.username} to={user.partner}
          onClose={() => setModal(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
