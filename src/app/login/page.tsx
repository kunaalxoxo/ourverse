'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { login, storeUser, getStoredUser } from '@/lib/auth';
import BloomBackground from '@/components/BloomBackground';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [u, setU]       = useState('');
  const [p, setP]       = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);

  // useAnimate gives us imperative control — no invalid custom props needed
  const [formRef, animate] = useAnimate();

  useEffect(() => { if (getStoredUser()) router.replace('/home'); }, [router]);

  const shakeForm = async () => {
    await animate(formRef.current, { x: [-7, 7, -5, 5, -2, 2, 0] }, { duration: 0.42, ease: 'easeOut' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    await new Promise(r => setTimeout(r, 420));
    const user = login(u, p);
    if (user) { storeUser(user); router.push('/home'); }
    else {
      setErr("Hmm, that doesn't seem right.");
      setBusy(false);
      shakeForm();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative px-5">
      <ParticleCanvas />
      <BloomBackground />

      <div className="relative z-10 w-full max-w-[340px]">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <h1
            className="font-display text-[36px] font-medium tracking-tight"
            style={{ color: 'rgba(240,232,244,0.88)', letterSpacing: '-0.025em', lineHeight: 1 }}
          >
            Our Verse
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 8 }}>
            a private little universe
          </p>
        </motion.div>

        {/* Card — ref from useAnimate, plain motion.form with valid props only */}
        <motion.form
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
          onSubmit={submit}
          className="surface rounded-2xl p-7 space-y-4"
          style={{ boxShadow: '0 24px 72px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,179,198,0.05)' }}
        >
          {/* Username */}
          <div>
            <label className="label block mb-1.5">Username</label>
            <input
              value={u}
              onChange={e => setU(e.target.value)}
              placeholder="who are you?"
              className="px-4 py-3"
              required
              autoComplete="off"
            />
          </div>

          {/* Password */}
          <div>
            <label className="label block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={p}
                onChange={e => setP(e.target.value)}
                placeholder="your little secret"
                className="px-4 py-3 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {err && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 12, color: 'rgba(255,179,198,0.65)', textAlign: 'center' }}
              >
                {err}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={busy}
            className="btn-primary w-full mt-1"
          >
            {busy ? 'Opening…' : 'Enter our world'}
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', marginTop: 24 }}
        >
          Just the two of us in here 🔒
        </motion.p>
      </div>
    </main>
  );
}
