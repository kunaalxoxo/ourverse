'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser, logout } from '@/lib/auth';
import { Heart, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ displayName: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setUser(getStoredUser()); }, [pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (!user) return null;

  const links = [
    { href: '/home', label: 'Home' },
    { href: '/coupons', label: 'Coupons' },
  ];

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/[0.045]' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Brand */}
        <Link href="/home" className="flex items-center gap-2 group">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={13} className="text-[#FFB3C6] fill-[#FFB3C6]" />
          </motion.span>
          <span className="font-display text-[14px] tracking-wide text-white/70 group-hover:text-white/90 transition-colors duration-300">
            Our Verse
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-1.5 text-[12.5px] rounded-full transition-colors duration-300 ${
                  active ? 'text-[#FFB3C6]' : 'text-white/35 hover:text-white/65'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(255,179,198,0.09)', border: '1px solid rgba(255,179,198,0.16)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}

          {/* Separator */}
          <div className="w-px h-3 mx-2" style={{ background: 'rgba(255,255,255,0.08)' }} />

          <button
            onClick={() => { logout(); router.push('/'); }}
            className="p-2 text-white/20 hover:text-white/50 transition-colors rounded-full"
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/35 hover:text-white/60 transition-colors"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden glass border-t border-white/[0.04]"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-[13px] transition-colors ${
                    pathname === l.href ? 'text-[#FFB3C6]' : 'text-white/35'
                  }`}>
                  {l.label}
                </Link>
              ))}
              <button onClick={() => { logout(); router.push('/'); }}
                className="px-4 py-3 text-left text-[12px] text-white/20 mt-1">
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
