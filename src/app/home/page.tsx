'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getStoredUser } from '@/lib/auth';
import BloomBackground from '@/components/BloomBackground';
import ParticleCanvas from '@/components/ParticleCanvas';
import RelationshipTimer from '@/components/RelationshipTimer';
import AffirmationCarousel from '@/components/AffirmationCarousel';
import Navbar from '@/components/Navbar';
import { ExternalLink, Heart, Sparkles } from 'lucide-react';

const PROJECTS = [
  {
    url: 'https://oneyear-black.vercel.app/',
    title: 'One Year',
    description: 'A year of love, captured in pixels.',
    gradient: 'from-rose-500/20 to-pink-600/20',
    border: 'rgba(244,114,182,0.2)',
  },
  {
    url: 'https://ily-phi-liard.vercel.app/',
    title: 'I Love You',
    description: 'Three words, infinite meaning.',
    gradient: 'from-purple-500/20 to-violet-600/20',
    border: 'rgba(168,85,247,0.2)',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string; emoji: string } | null>(null);
  const [switchOn, setSwitchOn] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) router.replace('/login');
    else setUser(u);
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
      <ParticleCanvas />
      <BloomBackground />
      <Navbar />

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 pt-20"
      >
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-pink-300/60 text-sm uppercase tracking-[0.3em] mb-4"
        >
          Welcome back, {user.emoji} {user.displayName}
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-5xl md:text-7xl text-center font-light text-white mb-4 glow-text"
        >
          Our Story So Far
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/30 text-sm mb-10 tracking-widest uppercase"
        >
          Since November 18, 2024
        </motion.p>

        {/* Timer */}
        <RelationshipTimer />

        {/* Affirmations */}
        <div className="mt-10">
          <AffirmationCarousel />
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 text-white/20 text-xs flex flex-col items-center gap-1"
        >
          <span>scroll</span>
          <span>↓</span>
        </motion.div>
      </motion.section>

      {/* Toggle Section */}
      <section className="relative z-10 py-24 px-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto">
          {/* Toggle Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-6 mb-16"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/40">{switchOn ? 'Create Mode' : 'Explore Mode'}</span>
              <label className="toggle-container">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={switchOn}
                  onChange={() => setSwitchOn(!switchOn)}
                />
                <span className="toggle-slider" />
              </label>
              <span className="text-sm text-pink-300/60">{switchOn ? '✨ On' : '○ Off'}</span>
            </div>
            <p className="text-center text-white/30 text-sm">
              {switchOn ? 'Build something special for them 💌' : 'Take a peek at what was built for you 🌸'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {switchOn ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="glass-card rounded-3xl p-8 text-center">
                  <div className="text-4xl mb-4">🎁</div>
                  <h2 className="font-display text-3xl text-white mb-3">Create a Coupon</h2>
                  <p className="text-white/40 text-sm mb-6">
                    Craft something special for {user.displayName === 'Kunaal' ? 'Gudduu' : 'Kunaal'}. A moment, a gesture, a little surprise.
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    href="/add-coupon"
                    className="inline-block px-8 py-3 rounded-xl text-sm font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #f472b6, #a855f7)',
                      color: 'white',
                      boxShadow: '0 0 30px rgba(244,114,182,0.3)',
                    }}
                  >
                    Create a Coupon ✨
                  </motion.a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="explore"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-10">
                  <p className="text-white/50 text-base leading-relaxed font-light">
                    Hey, if you&apos;re curious about the things I&apos;ve built —
                    <br />
                    <span className="text-pink-300/70">they were all made thinking of you 🌸</span>
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {PROJECTS.map((project, i) => (
                    <motion.a
                      key={project.url}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      whileHover={{ scale: 1.04, y: -4 }}
                      className={`glass-card rounded-2xl p-6 block group bg-gradient-to-br ${project.gradient}`}
                      style={{ border: `1px solid ${project.border}` }}
                    >
                      <div
                        className="w-full h-32 rounded-xl mb-4 overflow-hidden flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${project.border.replace('0.2', '0.1')}, transparent)` }}
                      >
                        <Heart size={40} className="text-pink-400/40 fill-pink-400/20 group-hover:text-pink-400/60 transition-colors" />
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-xl text-white mb-1">{project.title}</h3>
                          <p className="text-white/40 text-sm">{project.description}</p>
                        </div>
                        <ExternalLink size={16} className="text-white/30 group-hover:text-white/60 mt-1 transition-colors" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center px-6 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-4">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Heart size={18} className="text-pink-400/50 fill-pink-400/30" />
            </motion.div>
          </div>
          <p className="font-script text-lg text-white/30">
            Some stories aren&apos;t written in books — they&apos;re written in moments together.
          </p>
          <p className="text-white/15 text-xs mt-3 tracking-widest">OURVERSE · {new Date().getFullYear()}</p>
        </motion.div>
      </footer>
    </div>
  );
}
