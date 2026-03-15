'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { login, storeUser, getStoredUser } from '@/lib/auth';
import BloomBackground from '@/components/BloomBackground';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => { if (getStoredUser()) router.replace('/home'); }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    await new Promise(r => setTimeout(r, 500));
    const user = login(u, p);
    if (user) { storeUser(user); router.push('/home'); }
    else {
      setErr('Hmm, that doesn\'t seem right.');
      setShake(true); setTimeout(() => setShake(false), 500);
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative px-5">
      <ParticleCanvas />
      <BloomBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[360px]"
      >
        {/* Wordmark */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-[34px] font-medium text-white/90 tracking-tight"
          >
            Our Verse
          </motion.p>
          <p className="text-[13px] text-white/25 mt-1 font-light">a private little universe</p>
        </div>

        <motion.form
          animate={shake ? { x: [-8, 8, -6, 6, -2, 2, 0] } : {}}
          transition={{ duration: 0.4 }}
          onSubmit={submit}
          className="surface rounded-2xl p-7 space-y-4"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,179,198,0.06)' }}
        >
          <div>
            <label className="block text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1.5">Username</label>
            <input
              value={u} onChange={e => setU(e.target.value)}
              placeholder="who are you?" className="w-full px-4 py-3" required autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={p} onChange={e => setP(e.target.value)}
                placeholder="your little secret" className="w-full px-4 py-3 pr-10" required
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {err && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[12px] text-[#FFB3C6]/70 text-center">
                {err}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit" disabled={busy}
            className="w-full py-3 rounded-xl text-[13px] font-medium mt-1"
            style={{
              background: 'linear-gradient(135deg, rgba(255,179,198,0.85), rgba(234,220,248,0.85))',
              color: '#0F0F12',
              boxShadow: '0 0 30px rgba(255,179,198,0.12)',
            }}
          >
            {busy ? 'Opening…' : 'Enter our world'}
          </motion.button>
        </motion.form>

        <p className="text-center text-[11px] text-white/15 mt-6">
          Just the two of us in here 🔒
        </p>
      </motion.div>
    </main>
  );
}
