'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { login, storeUser, getStoredUser } from '@/lib/auth';
import BloomBackground from '@/components/BloomBackground';
import CursorGlow from '@/components/CursorGlow';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [u, setU]       = useState('');
  const [p, setP]       = useState('');
  const [show, setShow] = useState(false);
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);
  const [formRef, animate] = useAnimate();

  useEffect(() => { if (getStoredUser()) router.replace('/home'); }, [router]);

  const shakeForm = async () => {
    await animate(formRef.current, { x: [-6, 6, -4, 4, -2, 2, 0] }, { duration: 0.38, ease: 'easeOut' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    await new Promise(r => setTimeout(r, 380));
    const user = login(u, p);
    if (user) { storeUser(user); router.push('/home'); }
    else { setErr("Hmm, that doesn't seem right."); setBusy(false); shakeForm(); }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 20px', background: 'var(--bg)' }}>
      <CursorGlow />
      <BloomBackground />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 340 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.50, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <h1 className="font-display" style={{ fontSize: 38, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-primary)' }}>
            Our Verse
          </h1>
          <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            a private little universe
          </p>
        </motion.div>

        <motion.form
          ref={formRef}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
          onSubmit={submit}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 4px 32px rgba(15,23,42,0.07)' }}
        >
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Username</label>
            <input value={u} onChange={e => setU(e.target.value)} placeholder="who are you?" style={{ padding: '10px 14px' }} required autoComplete="off" />
          </div>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} value={p} onChange={e => setP(e.target.value)} placeholder="your little secret" style={{ padding: '10px 40px 10px 14px' }} required />
              <button type="button" onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', transition: 'color 0.18s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {err && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontSize: 12, color: 'var(--accent)', textAlign: 'center' }}
              >{err}</motion.p>
            )}
          </AnimatePresence>

          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={busy} className="btn-primary w-full" style={{ marginTop: 2 }}>
            {busy ? 'Opening…' : 'Enter our world'}
          </motion.button>
        </motion.form>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.50 }}
          style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', marginTop: 20 }}
        >Just the two of us in here 🔒</motion.p>
      </div>
    </main>
  );
}
