'use client';
import { useEffect, useState, useCallback } from 'react';
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
import MarqueeStrip from '@/components/MarqueeStrip';
import CursorGlow from '@/components/CursorGlow';
import { ArrowUpRight, Plus } from 'lucide-react';

const PROJECTS = [
  { url: 'https://oneyear-black.vercel.app/', index: '01', title: 'One Year', desc: 'A year of love, captured in pixels.', tag: 'Anniversary' },
  { url: 'https://ily-phi-liard.vercel.app/', index: '02', title: 'I Love You', desc: 'Three words, infinite meaning.', tag: 'Feeling' },
];

function reveal(delay = 0, yOffset = 32) {
  return {
    initial: { opacity: 0, y: yOffset }, whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-56px' },
    transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
  };
}

function SectionLine() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ originX: 0.5 }} className="section-line"
    />
  );
}

function Skeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <motion.div animate={{ opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-4">
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(232,213,176,0.12)' }} />
        <div style={{ width: 100, height: 10, borderRadius: 5, background: 'rgba(232,213,176,0.08)' }} />
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [user,    setUser]    = useState<{ displayName: string; username: string; partner: string } | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [modal,   setModal]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const load = useCallback(async () => {
    const u = getStoredUser();
    if (!u) { router.replace('/login'); return; }
    setUser(u);
    const data = await getCouponsForUser(u.username);
    setCoupons(data);
  }, [router]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const fn = () => { if (window.scrollY > 80) setScrolled(true); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (!user) return <Skeleton />;

  const heroWords = ['Our', 'Verse'];

  return (
    <div className="relative min-h-screen">
      <CursorGlow />
      <ParticleCanvas />
      <BloomBackground />
      <Navbar />

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 overflow-hidden">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.8 }} className="section-index" style={{ position: 'absolute', top: '88px', right: '24px' }}>01</motion.span>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="flex items-center gap-3 mb-12">
          <div className="eyebrow-line" />
          <span className="label tracking-[0.28em]">Since 18 November 2024</span>
          <div className="eyebrow-line" />
        </motion.div>
        <div className="hero-title-wrap">
          {heroWords.map((word, wi) => (
            <div key={word} className={`hero-word-row ${wi === 1 ? 'hero-word-row--right' : 'hero-word-row--left'}`}>
              {word.split('').map((char, ci) => (
                <motion.span key={ci} className="hero-char"
                  initial={{ opacity: 0, y: 60, rotateX: -40 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.4 + wi * 0.18 + ci * 0.055, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >{char}</motion.span>
              ))}
            </div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-14"><RelationshipTimer /></motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35, duration: 0.8 }} className="mt-8"><AffirmationCarousel /></motion.div>
        <motion.div
          animate={scrolled ? { opacity: 0, y: 8, pointerEvents: 'none' } : { y: [0, 6, 0], opacity: [0.25, 0.55, 0.25] }}
          transition={scrolled ? { duration: 0.5 } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="label" style={{ letterSpacing: '0.3em' }}>scroll</span>
          <div className="scroll-line" />
        </motion.div>
      </section>

      <div className="relative z-10"><MarqueeStrip /></div>

      {/* ─── COUPONS ──────────────────────────────── */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...reveal()} className="mb-18">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="label mb-3 block">Waiting for you</span>
                <h2 className="section-heading">Your Coupons</h2>
              </div>
              <span className="section-index">02</span>
            </div>
            <SectionLine />
          </motion.div>

          {coupons.length === 0 ? (
            <motion.p {...reveal(0.1)} className="text-center py-16" style={{ color: 'var(--text-faint)', fontSize: 13 }}>
              Nothing here yet — but good things are coming.
            </motion.p>
          ) : (
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              className="mt-12"
              /* Centre cards — flex wrap so lone cards sit in the middle */
              style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}
            >
              {coupons.map((c, i) => (
                <motion.div
                  key={c.id}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } } }}
                  className="relative"
                  /* Each card is fixed 280px wide so they tile evenly */
                  style={{ width: 280, flexShrink: 0 }}
                >
                  <span className="coupon-index">{String(i + 1).padStart(2, '0')}</span>
                  <CouponCard coupon={c} onUpdate={load} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div {...reveal(0.1)} className="flex justify-center mt-14">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setModal(true)} className="btn-ghost">
              <Plus size={13} /> Create a coupon for them
            </motion.button>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10"><MarqueeStrip inverted /></div>

      <section className="relative z-10 py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...reveal()} className="mb-18">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="label mb-3 block">Built before you knew</span>
                <h2 className="section-heading">Made with<br />you in mind</h2>
              </div>
              <span className="section-index">03</span>
            </div>
            <SectionLine />
          </motion.div>
          <div className="flex flex-col gap-0 mt-12">
            {PROJECTS.map((proj, i) => (
              <motion.a key={proj.url} href={proj.url} target="_blank" rel="noopener noreferrer" {...reveal(i * 0.12)} className="project-row group">
                <span className="project-row-index">{proj.index}</span>
                <div className="project-row-body">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="project-row-title">{proj.title}</h3>
                    <span className="pill pill-pink">{proj.tag}</span>
                  </div>
                  <p className="project-row-desc">{proj.desc}</p>
                </div>
                <motion.div className="project-row-arrow" whileHover={{ rotate: 45 }} transition={{ duration: 0.25 }}><ArrowUpRight size={18} /></motion.div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionLine />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }} className="pt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div>
              <p className="font-display text-[clamp(28px,5vw,42px)] font-medium leading-[1.1] max-w-xs" style={{ color: 'rgba(255,250,242,0.72)', letterSpacing: '-0.02em' }}>Some stories aren&apos;t written in books —</p>
              <p className="font-serif-light text-[clamp(22px,4vw,34px)] mt-2" style={{ color: 'rgba(255,250,242,0.26)' }}>they&apos;re written in moments together.</p>
            </div>
            <div className="text-right">
              <p className="label mb-2">Our Verse</p>
              <p className="label" style={{ color: 'var(--text-faint)' }}>{new Date().getFullYear()}</p>
            </div>
          </motion.div>
        </div>
      </footer>

      {modal && (
        <AddCouponModal from={user.username} to={user.partner} onClose={() => setModal(false)} onCreated={load} />
      )}
    </div>
  );
}
