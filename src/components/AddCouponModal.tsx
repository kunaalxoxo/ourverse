'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addCoupon } from '@/lib/coupons';
import { X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const EXAMPLES = [
  { name: 'Movie Night',      description: 'A cozy film night — you pick the movie 🎬', emoji: '🎬' },
  { name: 'Gaming Session',   description: 'One full gaming session together 🎮',      emoji: '🎮' },
  { name: 'Ice Cream Date',   description: 'Two scoops of happiness 🍦',               emoji: '🍦' },
  { name: 'One Free Hug',     description: 'Redeemable any time, no reason needed 🤍', emoji: '🤍' },
  { name: 'Breakfast in Bed', description: 'Morning cuddles with coffee ☕',            emoji: '☕' },
  { name: 'Surprise Outing',  description: 'Trust me on this one ✨',                  emoji: '✨' },
];

function FloatingOrb({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(18px)', opacity: 0 }}
      animate={{
        opacity: [0, 0.18, 0.08, 0.22, 0],
        x: [0, 12, -8, 16, 0],
        y: [0, -10, 14, -6, 0],
        scale: [1, 1.15, 0.9, 1.1, 1],
      }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

function spawnHearts() {
  const emojis = ['💗', '💖', '✨', '🌸', '💕'];
  for (let k = 0; k < 18; k++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'heart-float';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${10 + Math.random() * 80}vw`;
      el.style.top  = `${20 + Math.random() * 60}vh`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1600);
    }, k * 60);
  }
  confetti({
    particleCount: 80, spread: 70, origin: { y: 0.45 },
    colors: ['#E8D5B0', '#C49A6C', '#f0e4cc', '#d4b48a', '#fff8ee'],
    zIndex: 9999,
  });
  setTimeout(() => {
    confetti({
      particleCount: 40, spread: 100, origin: { y: 0.5 },
      colors: ['#ffd6e0', '#ffb3c6', '#E8D5B0'],
      startVelocity: 20, zIndex: 9999,
    });
  }, 300);
}

interface Props {
  from: string; to: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddCouponModal({ from, to, onClose, onCreated }: Props) {
  const [form, setForm]       = useState({ name: '', description: '', deadline: '', image_url: '' });
  const [busy, setBusy]       = useState(false);
  const [done, setDone]       = useState(false);
  const [err,  setErr]        = useState('');
  const [dateErr, setDateErr] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => { setTimeout(() => nameRef.current?.focus(), 180); }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const fill = (ex: typeof EXAMPLES[0]) =>
    setForm(p => ({ ...p, name: ex.name, description: ex.description }));

  const handleDeadlineChange = (val: string) => {
    setForm(p => ({ ...p, deadline: val }));
    if (val && val < todayStr) {
      setDateErr('That date has already passed — pick a future date 🌙');
    } else {
      setDateErr('');
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.deadline && form.deadline < todayStr) {
      setDateErr('That date has already passed — pick a future date 🌙');
      return;
    }
    setBusy(true); setErr('');
    const result = await addCoupon({
      from, to,
      name: form.name,
      description: form.description,
      deadline: form.deadline,
      image_url: form.image_url || undefined,
    });
    if (!result) {
      setErr('Something went wrong — please try again.');
      setBusy(false);
      return;
    }
    spawnHearts();
    setDone(true);
    setBusy(false);
    setTimeout(async () => {
      await onCreated();
      onClose();
    }, 1800);
  };

  const toName = to === 'gudduu' ? 'Gudduu' : 'Kunaal';

  const fieldVariants = {
    hidden:  { opacity: 0, y: 14 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.07, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const },
    }),
  };

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="modal-backdrop"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 32, rotateX: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.38, ease: [0.34, 1.26, 0.64, 1] }}
        className="surface-raised w-full max-w-[420px] overflow-hidden rounded-2xl relative"
        style={{
          boxShadow: '0 0 0 1px rgba(232,213,176,0.10), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(232,213,176,0.04)',
          minHeight: 340,
          perspective: 800,
        }}
      >
        {/* Floating ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <FloatingOrb x="10%"  y="15%" size={80}  delay={0}   color="rgba(232,213,176,0.6)" />
          <FloatingOrb x="65%" y="60%" size={100} delay={2.5} color="rgba(196,154,108,0.5)" />
          <FloatingOrb x="40%" y="80%" size={60}  delay={4.5} color="rgba(240,228,204,0.5)" />
        </div>

        {/* Shimmer line at top */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(232,213,176,0.5), transparent)',
            originX: 0.5, zIndex: 10,
          }}
        />

        <div className="relative" style={{ zIndex: 1 }}>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center px-8 text-center relative"
                style={{ minHeight: 340, paddingTop: 64, paddingBottom: 64 }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 80, height: 80,
                      border: '1px solid rgba(232,213,176,0.3)',
                      top: '50%', left: '50%',
                      translateX: '-50%', translateY: '-50%',
                    }}
                    animate={{ scale: [1, 2.8], opacity: [0.5, 0] }}
                    transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.1 }}
                  className="text-6xl mb-5 relative z-10"
                >💌</motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="font-display text-[22px] relative z-10"
                  style={{ color: 'var(--text-primary)' }}
                >Sent with love</motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.4 }}
                  className="text-[13px] mt-2 relative z-10"
                  style={{ color: 'var(--text-faint)' }}
                >Waiting for {toName} to find it 🌙</motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="flex items-center justify-between px-6 pt-6 pb-5"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 15, -10, 15, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Sparkles size={14} style={{ color: 'rgba(232,213,176,0.6)' }} />
                    </motion.div>
                    <div>
                      <h2 className="font-display text-[19px] font-medium" style={{ color: 'var(--text-primary)' }}>New Coupon</h2>
                      <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-faint)' }}>for {toName} 🌸</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(232,213,176,0.06)', color: 'rgba(232,213,176,0.35)' }}
                  >
                    <X size={14} />
                  </motion.button>
                </motion.div>

                {/* Quick ideas */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.18 }}
                  className="px-6 pb-5"
                >
                  <p className="label mb-2.5">Quick ideas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLES.map((ex, i) => (
                      <motion.button
                        key={ex.name}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.22 + i * 0.04, duration: 0.25, type: 'spring', stiffness: 300 }}
                        whileHover={{ scale: 1.06, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fill(ex)}
                        className="pill pill-pink cursor-pointer transition-colors"
                      >
                        {ex.emoji} {ex.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <div className="mx-6 h-px" style={{ background: 'var(--border)' }} />

                <form onSubmit={submit} className="px-6 pt-5 pb-6 space-y-4">
                  <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                    <label className="label block mb-1.5">Name</label>
                    <input ref={nameRef} value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Movie Night" className="px-4 py-3" required />
                  </motion.div>

                  <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                    <label className="label block mb-1.5">Description</label>
                    <textarea value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="What does this coupon mean?"
                      rows={3} className="px-4 py-3 resize-none" required />
                  </motion.div>

                  <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible"
                    className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label block mb-1.5">Valid Until</label>
                      <input
                        type="date"
                        value={form.deadline}
                        min={todayStr}
                        onChange={e => handleDeadlineChange(e.target.value)}
                        className="px-3 py-3"
                        style={dateErr ? { borderColor: 'rgba(232,150,120,0.6)' } : {}}
                      />
                      <AnimatePresence>
                        {dateErr && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-[11px] mt-1.5 leading-snug"
                            style={{ color: 'rgba(232,180,140,0.85)' }}
                          >{dateErr}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <label className="label block mb-1.5">Image URL</label>
                      <input type="url" value={form.image_url}
                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                        placeholder="https://…" className="px-3 py-3" />
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {err && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontSize: 12, color: 'rgba(232,180,140,0.8)', textAlign: 'center' }}>
                        {err}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                    <motion.button
                      type="submit"
                      disabled={busy || !!dateErr}
                      className="btn-primary w-full mt-1"
                      whileHover={!busy && !dateErr ? { scale: 1.02, y: -1 } : {}}
                      whileTap={!busy && !dateErr ? { scale: 0.98 } : {}}
                    >
                      {busy ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ display: 'inline-block' }}
                          >✦</motion.span>
                          Sending…
                        </span>
                      ) : 'Send with love ✨'}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
