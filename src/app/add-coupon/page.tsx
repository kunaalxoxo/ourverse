'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser } from '@/lib/auth';
import { addCoupon } from '@/lib/coupons';
import BloomBackground from '@/components/BloomBackground';
import ParticleCanvas from '@/components/ParticleCanvas';
import Navbar from '@/components/Navbar';
import { Heart, Sparkles, Image, Video, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const EXAMPLE_COUPONS = [
  { name: 'Movie Night Together', description: 'A cozy movie night, you pick the film 🎬', emoji: '🎬' },
  { name: 'Gaming Session', description: 'One fun gaming session — your choice of game 🎮', emoji: '🎮' },
  { name: 'Ice Cream Date', description: 'Two scoops of happiness, together 🍦', emoji: '🍦' },
  { name: 'One Free Hug', description: 'Redeemable anytime, anywhere 🤗', emoji: '🤗' },
  { name: 'Surprise Adventure', description: 'A mystery outing — trust me on this one 🌟', emoji: '🌟' },
  { name: 'Breakfast in Bed', description: 'Pancakes, coffee, and morning cuddles ☕', emoji: '☕' },
];

function fireHeartParticles() {
  const hearts = ['💗', '💕', '💖', '✨', '🌸'];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 40 + 30}vh;
        font-size: ${16 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 1.5s ease-out forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1600);
    }, i * 80);
  }

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.4 },
    colors: ['#f472b6', '#e879f9', '#a78bfa', '#fb7185', '#fde68a'],
  });
}

export default function AddCouponPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string; username: string; partner: string } | null>(null);
  const [form, setForm] = useState({ name: '', description: '', deadline: '', imageUrl: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) router.replace('/login');
    else setUser(u);
  }, [router]);

  const fillExample = (ex: (typeof EXAMPLE_COUPONS)[0]) => {
    setForm((prev) => ({ ...prev, name: ex.name, description: ex.description }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    addCoupon({
      from: user.username,
      to: user.partner,
      name: form.name,
      description: form.description,
      deadline: form.deadline,
      imageUrl: form.imageUrl || undefined,
    });
    fireHeartParticles();
    setSubmitted(true);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
      <style>{`
        @keyframes floatUp {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100px); opacity: 0; }
        }
      `}</style>
      <ParticleCanvas />
      <BloomBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.8, repeat: 2 }}
                className="text-6xl mb-6"
              >
                💌
              </motion.div>
              <h2 className="font-display text-4xl text-white mb-3">Coupon Sent!</h2>
              <p className="text-white/40 mb-8">
                Your coupon is waiting for {user.partner === 'gudduu' ? 'Gudduu' : 'Kunaal'} 🌸
              </p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  onClick={() => { setSubmitted(false); setForm({ name: '', description: '', deadline: '', imageUrl: '' }); }}
                  className="px-6 py-3 rounded-xl text-sm"
                  style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', color: '#f9a8d4' }}
                >
                  Create Another ✨
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  onClick={() => router.push('/coupons')}
                  className="px-6 py-3 rounded-xl text-sm"
                  style={{ background: 'linear-gradient(135deg, #f472b6, #a855f7)', color: 'white' }}
                >
                  View Coupons 🎁
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-10">
                <p className="text-pink-300/60 text-xs uppercase tracking-widest mb-2">For {user.partner === 'gudduu' ? 'Gudduu' : 'Kunaal'} 💌</p>
                <h1 className="font-display text-4xl md:text-5xl text-white glow-text">Create a Coupon</h1>
                <p className="text-white/30 text-sm mt-2">Something thoughtful, something sweet.</p>
              </div>

              {/* Quick Fill Examples */}
              <div className="mb-8">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Quick Ideas</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_COUPONS.map((ex) => (
                    <button
                      key={ex.name}
                      onClick={() => fillExample(ex)}
                      className="px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
                      style={{
                        background: 'rgba(244,114,182,0.08)',
                        border: '1px solid rgba(244,114,182,0.15)',
                        color: 'rgba(249,168,212,0.7)',
                      }}
                    >
                      {ex.emoji} {ex.name}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Coupon Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Movie Night Together"
                    className="w-full px-4 py-3 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the little surprise..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Valid Until (Optional)</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://... (paste an image link)"
                    className="w-full px-4 py-3 text-sm"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-medium text-sm mt-2 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #f472b6, #a855f7)',
                    color: 'white',
                    boxShadow: '0 0 40px rgba(244,114,182,0.3)',
                  }}
                >
                  {loading ? '💗 Wrapping with love...' : '✨ Send Coupon with Love'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
