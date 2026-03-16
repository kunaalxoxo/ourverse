'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addCoupon } from '@/lib/coupons';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

const EXAMPLES = [
  { name: 'Movie Night',      description: 'A cozy film night — you pick the movie 🎬', emoji: '🎬' },
  { name: 'Gaming Session',   description: 'One full gaming session together 🎮',      emoji: '🎮' },
  { name: 'Ice Cream Date',   description: 'Two scoops of happiness 🍦',               emoji: '🍦' },
  { name: 'One Free Hug',     description: 'Redeemable any time, no reason needed 🤍', emoji: '🤍' },
  { name: 'Breakfast in Bed', description: 'Morning cuddles with coffee ☕',            emoji: '☕' },
  { name: 'Surprise Outing',  description: 'Trust me on this one ✨',                  emoji: '✨' },
];

function spawnHearts() {
  const emojis = ['💗', '💖', '✨', '🌸', '💕'];
  for (let k = 0; k < 14; k++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'heart-float';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${18 + Math.random() * 64}vw`;
      el.style.top  = `${32 + Math.random() * 36}vh`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }, k * 75);
  }
  confetti({
    particleCount: 55, spread: 60, origin: { y: 0.5 },
    colors: ['#E8D5B0', '#C49A6C', '#f0e4cc', '#fff8ee'],
    zIndex: 9999,
  });
}

interface Props {
  from: string; to: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddCouponModal({ from, to, onClose, onCreated }: Props) {
  const [form, setForm] = useState({ name: '', description: '', deadline: '', image_url: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err,  setErr]  = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => nameRef.current?.focus(), 120); }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const fill = (ex: typeof EXAMPLES[0]) =>
    setForm(p => ({ ...p, name: ex.name, description: ex.description }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setTimeout(() => { onCreated(); onClose(); }, 1700);
  };

  const toName = to === 'gudduu' ? 'Gudduu' : 'Kunaal';

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="modal-backdrop"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="surface-raised w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ boxShadow: '0 48px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(232,213,176,0.07)' }}
        >
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="flex flex-col items-center justify-center py-16 px-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
                  className="text-5xl mb-5"
                >💌</motion.div>
                <p className="font-display text-[20px]" style={{ color: 'var(--text-primary)' }}>Sent with love</p>
                <p className="text-[12.5px] mt-1.5" style={{ color: 'var(--text-faint)' }}>Waiting for {toName} to find it.</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-5">
                  <div>
                    <h2 className="font-display text-[19px] font-medium" style={{ color: 'var(--text-primary)' }}>New Coupon</h2>
                    <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-faint)' }}>for {toName} 🌸</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }} onClick={onClose}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(232,213,176,0.06)', color: 'rgba(232,213,176,0.35)' }}
                  >
                    <X size={14} />
                  </motion.button>
                </div>

                {/* Quick ideas */}
                <div className="px-6 pb-5">
                  <p className="label mb-2.5">Quick ideas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLES.map(ex => (
                      <motion.button
                        key={ex.name} whileTap={{ scale: 0.96 }}
                        onClick={() => fill(ex)}
                        className="pill pill-pink cursor-pointer transition-all"
                      >
                        {ex.emoji} {ex.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mx-6 h-px" style={{ background: 'var(--border)' }} />

                {/* Fields */}
                <form onSubmit={submit} className="px-6 pt-5 pb-6 space-y-4">
                  <div>
                    <label className="label block mb-1.5">Name</label>
                    <input ref={nameRef} value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Movie Night" className="px-4 py-3" required />
                  </div>
                  <div>
                    <label className="label block mb-1.5">Description</label>
                    <textarea value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="What does this coupon mean?"
                      rows={3} className="px-4 py-3 resize-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label block mb-1.5">Valid Until</label>
                      <input type="date" value={form.deadline}
                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                        className="px-3 py-3" />
                    </div>
                    <div>
                      <label className="label block mb-1.5">Image URL</label>
                      <input type="url" value={form.image_url}
                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                        placeholder="https://…" className="px-3 py-3" />
                    </div>
                  </div>

                  {err && (
                    <p style={{ fontSize: 12, color: 'rgba(232,213,176,0.55)', textAlign: 'center' }}>{err}</p>
                  )}

                  <button type="submit" disabled={busy} className="btn-primary w-full mt-1">
                    {busy ? 'Sending…' : 'Send with love ✨'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
