'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser, logout } from '@/lib/auth';
import { Heart, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]       = useState<{ displayName: string } | null>(null);
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setUser(getStoredUser()); }, [pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (!user) return null;

  const links = [
    { href: '/home',    label: 'Home' },
    { href: '/coupons', label: 'Coupons' },
  ];

  return (
    <motion.header
      initial={{ y: -52, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-3xl mx-auto px-6 h-[56px] flex items-center justify-between">

        {/* Brand */}
        <Link href="/home" className="flex items-center gap-2 group">
          <Heart size={12} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
          <span className="font-display text-[13px]" style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Our Verse
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className="relative px-4 py-1.5 text-[12px] rounded-full transition-colors duration-200"
                style={{ color: active ? 'var(--text-primary)' : 'var(--text-faint)' }}
              >
                {active && (
                  <motion.span layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--surface-hi)', border: '1px solid var(--border-hi)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
          <div className="w-px h-3 mx-2" style={{ background: 'var(--border)' }} />
          <button onClick={() => { logout(); router.push('/'); }}
            className="p-2 rounded-full transition-colors duration-200"
            style={{ color: 'var(--text-faint)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
            title="Sign out"
          >
            <LogOut size={12} />
          </button>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden" style={{ color: 'var(--text-faint)' }}>
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden glass"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-[13px] transition-colors duration-200"
                  style={{ color: pathname === l.href ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >{l.label}</Link>
              ))}
              <button onClick={() => { logout(); router.push('/'); }}
                className="px-4 py-3 text-left text-[12px] mt-1"
                style={{ color: 'var(--text-faint)' }}
              >Sign out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
