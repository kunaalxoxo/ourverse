'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(20px)', opacity: 0 }}
      animate={{ opacity: [0, 0.16, 0.07, 0.20, 0], x: [0, 14, -8, 18, 0], y: [0, -12, 16, -6, 0], scale: [1, 1.2, 0.88, 1.12, 1] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* — AWWWARDS SUCCESS OVERLAY — full-screen cinematic moment */
function SuccessOverlay({ toName, onDone }: { toName: string; onDone: () => void }) {
  useEffect(() => {
    // double confetti burst
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 }, colors: ['#E8D5B0','#C49A6C','#f0e4cc','#fff8ee'], zIndex: 9999 });
    setTimeout(() => confetti({ particleCount: 50, spread: 120, origin: { y: 0.5 }, colors: ['#ffd6e0','#ffb3c6','#E8D5B0'], startVelocity: 18, zIndex: 9999 }), 350);
    // hearts
    const emojis = ['💗','💖','✨','🌸','💕'];
    for (let k = 0; k < 22; k++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'heart-float';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = `${8 + Math.random() * 84}vw`;
        el.style.top  = `${15 + Math.random() * 70}vh`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1600);
      }, k * 55);
    }
  }, []);

  const letters = 'Sent with love'.split('');
  const sub     = `Waiting for ${toName} \u2014 with every bit of my heart 🌙`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ink-bleed backdrop — two curtains slide apart */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.72, delay: 2.4, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #0C0B0A 0%, #1a1510 50%, #0C0B0A 100%)',
          transformOrigin: 'bottom',
          zIndex: 1,
        }}
      />

      {/* Ambient radial glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 0.55, 0.35], scale: [0.4, 1.8, 1.4] }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{
          position: 'absolute', width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,213,176,0.12) 0%, rgba(196,154,108,0.06) 40%, transparent 70%)',
          zIndex: 2, pointerEvents: 'none',
        }}
      />

      {/* Horizontal scan line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 0.5, 0.5, 0] }}
        transition={{ duration: 1.6, times: [0, 0.25, 0.75, 1], ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: '60%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,213,176,0.6), transparent)',
          zIndex: 3,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 4, textAlign: 'center', padding: '0 24px' }}>
        {/* Envelope — springs in */}
        <motion.div
          initial={{ scale: 0, rotate: -25, y: 30 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
          style={{ fontSize: 72, lineHeight: 1, marginBottom: 32, display: 'inline-block' }}
        >💌</motion.div>

        {/* Title — character-by-character reveal */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0, marginBottom: 20 }}>
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 22, rotateX: -60 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.3 + i * 0.045, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(32px, 6vw, 52px)',
                fontWeight: 500,
                color: 'rgba(255,250,242,0.90)',
                letterSpacing: '-0.02em',
                display: 'inline-block',
                whiteSpace: ch === ' ' ? 'pre' : 'normal',
              }}
            >{ch}</motion.span>
          ))}
        </div>

        {/* Divider line sweeps in */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            width: 64, height: 1, margin: '0 auto 18px',
            background: 'linear-gradient(90deg, transparent, rgba(232,213,176,0.50), transparent)',
            originX: 0.5,
          }}
        />

        {/* Sub text fades in */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.55 }}
          style={{ fontSize: 14, color: 'rgba(255,250,242,0.36)', fontWeight: 300, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', letterSpacing: '0.01em' }}
        >{sub}</motion.p>

        {/* Eyebrow — fades in last */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{ marginTop: 32, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.28em', color: 'rgba(232,213,176,0.20)' }}
        >Our Verse</motion.p>
      </div>
    </motion.div>
  );
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

  // 3-D tilt on card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [6, -6]);
  const rotateY = useTransform(mouseX, [-150, 150], [-6, 6]);

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
    setDateErr(val && val < todayStr ? 'That date has already passed — pick a future date 🌙' : '');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.deadline && form.deadline < todayStr) {
      setDateErr('That date has already passed — pick a future date 🌙');
      return;
    }
    setBusy(true); setErr('');
    const result = await addCoupon({ from, to, name: form.name, description: form.description, deadline: form.deadline, image_url: form.image_url || undefined });
    if (!result) { setErr('Something went wrong — please try again.'); setBusy(false); return; }
    setDone(true);
    setBusy(false);
    // Dismiss overlay after 3.2s, then refresh list + close modal
    setTimeout(async () => { await onCreated(); onClose(); }, 3200);
  };

  const toName = to === 'gudduu' ? 'Gudduu' : 'Kunaal';

  const fieldV = {
    hidden:  { opacity: 0, y: 14 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
  };

  return (
    <>
      {/* The actual modal (hidden behind overlay once done) */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="modal-backdrop"
        style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', zIndex: done ? -1 : 100 }}
        onClick={e => { if (e.target === e.currentTarget && !done) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 32, rotateX: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: [0.34, 1.26, 0.64, 1] }}
          style={{ rotateX, rotateY, perspective: 900 }}
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect();
            mouseX.set(e.clientX - r.left - r.width / 2);
            mouseY.set(e.clientY - r.top  - r.height / 2);
          }}
          onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
          className="surface-raised w-full max-w-[420px] overflow-hidden rounded-2xl relative"
          style={{ boxShadow: '0 0 0 1px rgba(232,213,176,0.10), 0 32px 80px rgba(0,0,0,0.75)', minHeight: 340 }}
        >
          {/* Ambient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            <FloatingOrb x="5%"  y="10%" size={90}  delay={0}   color="rgba(232,213,176,0.55)" />
            <FloatingOrb x="60%" y="55%" size={110} delay={2.5} color="rgba(196,154,108,0.50)" />
            <FloatingOrb x="35%" y="75%" size={65}  delay={4.5} color="rgba(240,228,204,0.45)" />
          </div>

          {/* Shimmer top edge */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(232,213,176,0.55), transparent)', originX: 0.5, zIndex: 10 }}
          />

          <div className="relative" style={{ zIndex: 1 }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex items-center justify-between px-6 pt-6 pb-5"
            >
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: [0, 15, -10, 15, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}>
                  <Sparkles size={14} style={{ color: 'rgba(232,213,176,0.60)' }} />
                </motion.div>
                <div>
                  <h2 className="font-display text-[19px] font-medium" style={{ color: 'var(--text-primary)' }}>New Coupon</h2>
                  <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-faint)' }}>for {toName} 🌸</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(232,213,176,0.06)', color: 'rgba(232,213,176,0.35)' }}
              ><X size={14} /></motion.button>
            </motion.div>

            {/* Quick ideas */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.18 }} className="px-6 pb-5">
              <p className="label mb-2.5">Quick ideas</p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map((ex, i) => (
                  <motion.button
                    key={ex.name}
                    initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.22 + i * 0.04, type: 'spring', stiffness: 320 }}
                    whileHover={{ scale: 1.07, y: -1 }} whileTap={{ scale: 0.94 }}
                    onClick={() => fill(ex)} className="pill pill-pink cursor-pointer"
                  >{ex.emoji} {ex.name}</motion.button>
                ))}
              </div>
            </motion.div>

            <div className="mx-6 h-px" style={{ background: 'var(--border)' }} />

            <form onSubmit={submit} className="px-6 pt-5 pb-6 space-y-4">
              <motion.div custom={0} variants={fieldV} initial="hidden" animate="visible">
                <label className="label block mb-1.5">Name</label>
                <input ref={nameRef} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Movie Night" className="px-4 py-3" required />
              </motion.div>

              <motion.div custom={1} variants={fieldV} initial="hidden" animate="visible">
                <label className="label block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does this coupon mean?" rows={3} className="px-4 py-3 resize-none" required />
              </motion.div>

              <motion.div custom={2} variants={fieldV} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label block mb-1.5">Valid Until</label>
                  <input type="date" value={form.deadline} min={todayStr} onChange={e => handleDeadlineChange(e.target.value)} className="px-3 py-3" style={dateErr ? { borderColor: 'rgba(232,150,120,0.6)' } : {}} />
                  <AnimatePresence>
                    {dateErr && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[11px] mt-1.5" style={{ color: 'rgba(232,180,140,0.85)' }}>{dateErr}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="label block mb-1.5">Image URL</label>
                  <input type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" className="px-3 py-3" />
                </div>
              </motion.div>

              <AnimatePresence>
                {err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: 'rgba(232,180,140,0.8)', textAlign: 'center' }}>{err}</motion.p>}
              </AnimatePresence>

              <motion.div custom={3} variants={fieldV} initial="hidden" animate="visible">
                <motion.button
                  type="submit" disabled={busy || !!dateErr} className="btn-primary w-full mt-1"
                  whileHover={!busy && !dateErr ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!busy && !dateErr ? { scale: 0.97 } : {}}
                >
                  {busy
                    ? <span className="flex items-center justify-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>✦</motion.span>Sending…</span>
                    : 'Send with love ✨'
                  }
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Full-screen success overlay — rendered above everything */}
      <AnimatePresence>
        {done && <SuccessOverlay toName={toName} onDone={onClose} />}
      </AnimatePresence>
    </>
  );
}
