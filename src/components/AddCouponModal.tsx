'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { addCoupon } from '@/lib/coupons';
import { X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const EXAMPLES = [
  { name: 'Movie Night',      description: 'A cozy film night — you pick the movie 🎬', emoji: '🎬' },
  { name: 'Gaming Session',   description: 'One full gaming session together 🎮',        emoji: '🎮' },
  { name: 'Ice Cream Date',   description: 'Two scoops of happiness 🍦',                 emoji: '🍦' },
  { name: 'One Free Hug',     description: 'Redeemable any time, no reason needed 🤍',   emoji: '🤍' },
  { name: 'Breakfast in Bed', description: 'Morning cuddles with coffee ☕',              emoji: '☕' },
  { name: 'Surprise Outing',  description: 'Trust me on this one ✨',                    emoji: '✨' },
];

function SuccessOverlay({ toName }: { toName: string; onDone: () => void }) {
  useEffect(() => {
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.4 }, colors: ['#C97B84','#f0b8bc','#fde8ea','#ffffff'], zIndex: 9999 });
    setTimeout(() => confetti({ particleCount: 40, spread: 100, origin: { y: 0.5 }, colors: ['#C97B84','#fde8ea'], startVelocity: 14, zIndex: 9999 }), 300);
    const emojis = ['💗','💖','✨','🌸','💕'];
    for (let k = 0; k < 18; k++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'heart-float';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = `${8 + Math.random() * 84}vw`;
        el.style.top  = `${15 + Math.random() * 70}vh`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1400);
      }, k * 55);
    }
  }, []);

  const letters = 'Sent with love'.split('');

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(247,245,242,0.96)', backdropFilter: 'blur(20px)',
      }}
    >
      {/* Subtle blush glow behind content */}
      <div style={{
        position: 'absolute', width: 440, height: 440, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,123,132,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
        {/* Envelope */}
        <motion.div
          initial={{ scale: 0, rotate: -20, y: 24 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.10 }}
          style={{ fontSize: 64, lineHeight: 1, marginBottom: 24, display: 'inline-block' }}
        >💌</motion.div>

        {/* Title — character reveal */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {letters.map((ch, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + i * 0.035, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 500,
                color: 'var(--text-primary)', letterSpacing: '-0.02em',
                display: 'inline-block',
                whiteSpace: ch === ' ' ? 'pre' : 'normal',
              }}
            >{ch}</motion.span>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          style={{ width: 40, height: 1, margin: '0 auto 14px', background: 'var(--border-hi)', originX: 0.5 }}
        />

        <motion.p
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.40 }}
          style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}
        >Waiting for {toName} — with every bit of my heart 🌙</motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.45 }}
          style={{ marginTop: 24, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.24em', color: 'var(--text-faint)' }}
        >Our Verse</motion.p>
      </div>
    </motion.div>
  );
}

interface Props { from: string; to: string; onClose: () => void; onCreated: () => void; }

export default function AddCouponModal({ from, to, onClose, onCreated }: Props) {
  const [form, setForm]       = useState({ name: '', description: '', deadline: '', image_url: '' });
  const [busy, setBusy]       = useState(false);
  const [done, setDone]       = useState(false);
  const [err,  setErr]        = useState('');
  const [dateErr, setDateErr] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [4, -4]);
  const rotateY = useTransform(mouseX, [-150, 150], [-4, 4]);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => { setTimeout(() => nameRef.current?.focus(), 140); }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const fill = (ex: typeof EXAMPLES[0]) => setForm(p => ({ ...p, name: ex.name, description: ex.description }));

  const handleDeadlineChange = (val: string) => {
    setForm(p => ({ ...p, deadline: val }));
    setDateErr(val && val < todayStr ? 'Pick a date in the future 🌙' : '');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.deadline && form.deadline < todayStr) { setDateErr('Pick a date in the future 🌙'); return; }
    setBusy(true); setErr('');
    const result = await addCoupon({ from, to, name: form.name, description: form.description, deadline: form.deadline, image_url: form.image_url || undefined });
    if (!result) { setErr('Something went wrong — please try again.'); setBusy(false); return; }
    setDone(true); setBusy(false);
    setTimeout(async () => { await onCreated(); onClose(); }, 2800);
  };

  const toName = to === 'gudduu' ? 'Gudduu' : 'Kunaal';

  const fieldV = {
    hidden:  { opacity: 0, y: 10 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.055, duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
  };

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="modal-backdrop"
        style={{ zIndex: done ? -1 : 100 }}
        onClick={e => { if (e.target === e.currentTarget && !done) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.26, ease: [0.34, 1.26, 0.64, 1] }}
          style={{
            rotateX, rotateY, perspective: 900,
            boxShadow: '0 4px 40px rgba(15,23,42,0.10), 0 0 0 1px var(--border)',
            minHeight: 340, willChange: 'transform, opacity',
          }}
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect();
            mouseX.set(e.clientX - r.left - r.width / 2);
            mouseY.set(e.clientY - r.top  - r.height / 2);
          }}
          onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
          className="surface-raised w-full max-w-[420px] overflow-hidden rounded-2xl relative"
        >
          {/* Shimmer top edge */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.50, delay: 0.12 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-border), transparent)', originX: 0.5, zIndex: 10 }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.06 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 18px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <motion.div animate={{ rotate: [0, 12, -8, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}>
                  <Sparkles size={13} style={{ color: 'var(--accent)' }} />
                </motion.div>
                <div>
                  <h2 className="font-display" style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' }}>New Coupon</h2>
                  <p style={{ fontSize: 11, marginTop: 2, color: 'var(--text-faint)' }}>for {toName} 🌸</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.16 }}
                onClick={onClose}
                style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
              ><X size={13} /></motion.button>
            </motion.div>

            {/* Quick ideas */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.10 }} style={{ padding: '0 24px 18px' }}>
              <p className="label" style={{ marginBottom: 10 }}>Quick ideas</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EXAMPLES.map((ex, i) => (
                  <motion.button key={ex.name}
                    initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.14 + i * 0.03, type: 'spring', stiffness: 360, damping: 24 }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                    onClick={() => fill(ex)}
                    className="pill pill-pink"
                    style={{ cursor: 'pointer', fontSize: 10 }}
                  >{ex.emoji} {ex.name}</motion.button>
                ))}
              </div>
            </motion.div>

            <div style={{ height: 1, background: 'var(--border)', margin: '0 24px' }} />

            <form onSubmit={submit} style={{ padding: '18px 24px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <motion.div custom={0} variants={fieldV} initial="hidden" animate="visible">
                <label className="label" style={{ display: 'block', marginBottom: 6 }}>Name</label>
                <input ref={nameRef} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Movie Night" style={{ padding: '10px 14px' }} required />
              </motion.div>
              <motion.div custom={1} variants={fieldV} initial="hidden" animate="visible">
                <label className="label" style={{ display: 'block', marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does this coupon mean?" rows={3} style={{ padding: '10px 14px', resize: 'none' }} required />
              </motion.div>
              <motion.div custom={2} variants={fieldV} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Valid Until</label>
                  <input type="date" value={form.deadline} min={todayStr} onChange={e => handleDeadlineChange(e.target.value)} style={{ padding: '10px 12px', ...(dateErr ? { borderColor: 'var(--accent)' } : {}) }} />
                  <AnimatePresence>
                    {dateErr && (
                      <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ fontSize: 11, marginTop: 5, color: 'var(--accent)' }}
                      >{dateErr}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Image URL</label>
                  <input type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" style={{ padding: '10px 12px' }} />
                </div>
              </motion.div>
              <AnimatePresence>
                {err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: 'var(--accent)', textAlign: 'center' }}>{err}</motion.p>}
              </AnimatePresence>
              <motion.div custom={3} variants={fieldV} initial="hidden" animate="visible">
                <motion.button type="submit" disabled={busy || !!dateErr} className="btn-primary w-full"
                  whileHover={!busy && !dateErr ? { scale: 1.02 } : {}}
                  whileTap={!busy && !dateErr ? { scale: 0.98 } : {}}
                >
                  {busy
                    ? <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>✦</motion.span>Sending…</span>
                    : 'Send with love ✨'
                  }
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {done && <SuccessOverlay toName={toName} onDone={onClose} />}
      </AnimatePresence>
    </>
  );
}
