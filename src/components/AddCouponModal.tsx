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
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(20px)', opacity: 0, willChange: 'transform, opacity' }}
      animate={{ opacity: [0, 0.14, 0.06, 0.18, 0], x: [0, 12, -6, 14, 0], y: [0, -10, 12, -5, 0] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

function SuccessOverlay({ toName }: { toName: string; onDone: () => void }) {
  useEffect(() => {
    confetti({ particleCount: 80, spread: 75, origin: { y: 0.4 }, colors: ['#C8B8F0','#E8A598','#f0e8ff','#fff0ee'], zIndex: 9999 });
    setTimeout(() => confetti({ particleCount: 45, spread: 110, origin: { y: 0.5 }, colors: ['#ffd6e0','#C8B8F0','#E8A598'], startVelocity: 16, zIndex: 9999 }), 320);
    const emojis = ['💗','💖','✨','🌸','💕'];
    for (let k = 0; k < 20; k++) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Ink curtain */}
      <motion.div
        initial={{ scaleY: 1 }} animate={{ scaleY: 0 }}
        transition={{ duration: 0.65, delay: 2.2, ease: [0.76, 0, 0.24, 1] as const }}
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0D0E12 0%, #171022 50%, #0D0E12 100%)', transformOrigin: 'bottom', zIndex: 1 }}
      />
      {/* Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: [0, 0.5, 0.30], scale: [0.4, 1.7, 1.3] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ position: 'absolute', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,184,240,0.14) 0%, rgba(232,165,152,0.07) 45%, transparent 70%)', zIndex: 2, pointerEvents: 'none' }}
      />
      {/* Scan line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 0.45, 0.45, 0] }}
        transition={{ duration: 1.4, times: [0, 0.25, 0.75, 1] }}
        style={{ position: 'absolute', width: '55%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,184,240,0.65), transparent)', zIndex: 3 }}
      />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 4, textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ scale: 0, rotate: -25, y: 28 }} animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 15, delay: 0.12 }}
          style={{ fontSize: 68, lineHeight: 1, marginBottom: 28, display: 'inline-block' }}
        >💌</motion.div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          {letters.map((ch, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, y: 18, rotateX: -50 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.28 + i * 0.038, duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(30px, 5.5vw, 48px)', fontWeight: 500,
                color: 'rgba(242,240,255,0.92)', letterSpacing: '-0.02em',
                display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal',
              }}
            >{ch}</motion.span>
          ))}
        </div>
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{ width: 56, height: 1, margin: '0 auto 16px', background: 'linear-gradient(90deg, transparent, rgba(200,184,240,0.50), transparent)', originX: 0.5 }}
        />
        <motion.p
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.45 }}
          style={{ fontSize: 14, color: 'rgba(200,196,230,0.42)', fontWeight: 300, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}
        >Waiting for {toName} — with every bit of my heart 🌙</motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          style={{ marginTop: 28, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.28em', color: 'rgba(200,184,240,0.22)' }}
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
  const rotateX = useTransform(mouseY, [-150, 150], [5, -5]);
  const rotateY = useTransform(mouseX, [-150, 150], [-5, 5]);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => { setTimeout(() => nameRef.current?.focus(), 160); }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const fill = (ex: typeof EXAMPLES[0]) => setForm(p => ({ ...p, name: ex.name, description: ex.description }));

  const handleDeadlineChange = (val: string) => {
    setForm(p => ({ ...p, deadline: val }));
    setDateErr(val && val < todayStr ? 'That date has already passed — pick a future date 🌙' : '');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.deadline && form.deadline < todayStr) { setDateErr('That date has already passed — pick a future date 🌙'); return; }
    setBusy(true); setErr('');
    const result = await addCoupon({ from, to, name: form.name, description: form.description, deadline: form.deadline, image_url: form.image_url || undefined });
    if (!result) { setErr('Something went wrong — please try again.'); setBusy(false); return; }
    setDone(true); setBusy(false);
    setTimeout(async () => { await onCreated(); onClose(); }, 3000);
  };

  const toName = to === 'gudduu' ? 'Gudduu' : 'Kunaal';

  const fieldV = {
    hidden:  { opacity: 0, y: 12 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.30, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
  };

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.20 }}
        className="modal-backdrop"
        style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', zIndex: done ? -1 : 100 }}
        onClick={e => { if (e.target === e.currentTarget && !done) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.90, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ duration: 0.30, ease: [0.34, 1.26, 0.64, 1] }}
          style={{
            rotateX, rotateY,
            perspective: 900,
            boxShadow: '0 0 0 1px rgba(200,184,240,0.10), 0 28px 70px rgba(0,0,0,0.70)',
            minHeight: 340,
            willChange: 'transform, opacity',
          }}
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect();
            mouseX.set(e.clientX - r.left - r.width / 2);
            mouseY.set(e.clientY - r.top  - r.height / 2);
          }}
          onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
          className="surface-raised w-full max-w-[420px] overflow-hidden rounded-2xl relative"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            <FloatingOrb x="5%"  y="10%" size={80}  delay={0}   color="rgba(200,184,240,0.50)" />
            <FloatingOrb x="62%" y="55%" size={100} delay={2.5} color="rgba(232,165,152,0.45)" />
            <FloatingOrb x="35%" y="78%" size={60}  delay={4.5} color="rgba(200,184,240,0.38)" />
          </div>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,184,240,0.55), transparent)', originX: 0.5, zIndex: 10 }}
          />
          <div className="relative" style={{ zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.08 }}
              className="flex items-center justify-between px-6 pt-6 pb-5"
            >
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: [0, 15, -10, 15, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}>
                  <Sparkles size={14} style={{ color: 'rgba(200,184,240,0.60)' }} />
                </motion.div>
                <div>
                  <h2 className="font-display text-[19px] font-medium" style={{ color: 'var(--text-primary)' }}>New Coupon</h2>
                  <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-faint)' }}>for {toName} 🌸</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.18 }}
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(200,184,240,0.07)', color: 'rgba(200,184,240,0.40)' }}
              ><X size={14} /></motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.14 }} className="px-6 pb-5">
              <p className="label mb-2.5">Quick ideas</p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map((ex, i) => (
                  <motion.button key={ex.name}
                    initial={{ opacity: 0, scale: 0.84 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.18 + i * 0.035, type: 'spring', stiffness: 350, damping: 22 }}
                    whileHover={{ scale: 1.06, y: -1 }} whileTap={{ scale: 0.94 }}
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
                  <input type="date" value={form.deadline} min={todayStr} onChange={e => handleDeadlineChange(e.target.value)} className="px-3 py-3" style={dateErr ? { borderColor: 'rgba(232,150,140,0.65)' } : {}} />
                  <AnimatePresence>
                    {dateErr && (
                      <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[11px] mt-1.5" style={{ color: 'rgba(232,165,152,0.90)' }}>{dateErr}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="label block mb-1.5">Image URL</label>
                  <input type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" className="px-3 py-3" />
                </div>
              </motion.div>
              <AnimatePresence>
                {err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: 'rgba(232,165,152,0.88)', textAlign: 'center' }}>{err}</motion.p>}
              </AnimatePresence>
              <motion.div custom={3} variants={fieldV} initial="hidden" animate="visible">
                <motion.button
                  type="submit" disabled={busy || !!dateErr} className="btn-primary w-full mt-1"
                  whileHover={!busy && !dateErr ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!busy && !dateErr ? { scale: 0.97 } : {}}
                >
                  {busy
                    ? <span className="flex items-center justify-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>✦</motion.span>Sending…</span>
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
