'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { login, storeUser, getStoredUser } from '@/lib/auth';
import BloomBackground from '@/components/BloomBackground';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Heart, Eye, EyeOff, Loader } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const u = getStoredUser();
    if (u) router.replace('/home');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));
    const user = login(username, password);
    if (user) {
      storeUser(user);
      router.push('/home');
    } else {
      setError('Hmm, that doesn\'t seem right. Try again 💭');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <ParticleCanvas />
      <BloomBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-3xl p-8 md:p-10"
          style={{ boxShadow: '0 0 80px rgba(244,114,182,0.08), 0 0 160px rgba(168,85,247,0.05)' }}
        >
          {/* Heart icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(244,114,182,0.3)' }}
            >
              <Heart size={28} className="text-pink-400 fill-pink-400" />
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-script text-4xl text-white mb-2">Ourverse</h1>
            <p className="text-white/40 text-sm">A private little universe for two</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="who are you?"
                className="w-full px-4 py-3 text-sm"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="your little secret"
                  className="w-full px-4 py-3 text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-pink-400/80 text-xs text-center py-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-medium text-sm mt-2 flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'linear-gradient(135deg, #f472b6, #a855f7)',
                boxShadow: '0 0 30px rgba(244,114,182,0.3)',
                color: 'white',
              }}
            >
              {loading ? (
                <><Loader size={16} className="animate-spin" /> Entering...</>
              ) : (
                <>Enter our world ✨</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/20 text-xs mt-6">
            🔒 This space belongs to just us two
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
