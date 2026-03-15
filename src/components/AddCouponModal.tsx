'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addCoupon } from '@/lib/coupons';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

const EXAMPLES = [
  { name: 'Movie Night', description: 'A cozy film night — you pick the movie 🎬', emoji: '🎬' },
  { name: 'Gaming Session', description: 'One full gaming session together 🎮', emoji: '🎮' },
  { name: 'Ice Cream Date', description: 'Two scoops of happiness 🍦', emoji: '🍦' },
  { name: 'One Free Hug', description: 'Redeemable any time, no reason needed 🤍', emoji: '🤍' },
  { name: 'Breakfast in Bed', description: 'Morning cuddles with coffee ☕', emoji: '☕' },
  { name: 'Surprise Adventure', description: 'Trust me on this one ✨', emoji: '✨' },
];

function spawnHearts() {
  const emojis = ['💗', '💖', '✨', '🌸', '💕'];
  for (let i = 0; i < 16; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'heart-float';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${20 + Math.random() * 60}vw`;
      el.style.top = `${30 + Math.random() * 40}vh`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }, i * 70);
  }
  confetti({ particleCount: 60, spread: 65, origin: { y: 0.5 }, colors: ['#FFB3C6', '#EADCF8', '#f9a8d4'], zIndex: 9999 });
}

interface Props {
  from: string;
  to: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddCouponModal({ from, to, onClose, onCreated }: Props) {
  const [form, setForm] = useState({ name: '', description: '', deadline: '', imageUrl: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const fill = (ex: (typeof EXAMPLES)[0]) =>
    setForm(p => ({ ...p, name: ex.name, description: ex.description }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await new Promise(r => setTimeout(r, 350));
    addCoupon({ from, to, name: form.name, description: form.description, deadline: form.deadline, imageUrl: form.imageUrl || undefined });
    spawnHearts();
    setDone(true);
    setBusy(false);
    setTimeout(() => { onCreated(); onClose(); }, 1800);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="surface-raised rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,179,198,0.08)' }}
        >
          {done ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-5xl mb-4"
              >💌</motion.div>
              <p className="font-display text-xl text-white/80">Sent with love</p>
              <p className="text-sm text-white/30 mt-2">Waiting for them to find it.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div>
                  <h2 className="font-display text-xl text-white/90">New Coupon</h2>
                  <p className="text-[12px] text-white/30 mt-0.5">for {to === 'gudduu' ? 'Gudduu' : 'Kunaal'} 🌸</p>
                </div>
                <button onClick={onClose} className="p-2 text-white/25 hover:text-white/60 transition-colors rounded-full">
                  <X size={16} />
                </button>
              </div>

              {/* Quick ideas */}
              <div className="px-6 pb-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/20 mb-2.5">Quick ideas</p>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLES.map(ex => (
                    <button
                      key={ex.name}
                      onClick={() => fill(ex)}
                      className="px-2.5 py-1 rounded-full text-[11px] transition-all hover:scale-105"
                      style={{ background: 'rgba(255,179,198,0.07)', border: '1px solid rgba(255,179,198,0.12)', color: 'rgba(255,179,198,0.6)' }}
                    >
                      {ex.emoji} {ex.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px mx-6" style={{ background: 'rgba(255,179,198,0.06)' }} />

              {/* Form */}
              <form onSubmit={submit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1.5">Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Movie Night" className="w-full px-4 py-3" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does this coupon mean?" rows={3} className="w-full px-4 py-3 resize-none" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1.5">Valid Until</label>
                    <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-3" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1.5">Image URL</label>
                    <input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" className="w-full px-3 py-3" />
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 rounded-xl text-[13px] font-medium"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,179,198,0.9), rgba(234,220,248,0.9))',
                    color: '#0F0F12',
                    boxShadow: '0 0 30px rgba(255,179,198,0.15)',
                  }}
                >
                  {busy ? 'Sending…' : 'Send with love ✨'}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
