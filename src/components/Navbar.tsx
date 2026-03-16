'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser, logout } from '@/lib/auth';
import { Heart, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router    = useRouter();
  const pathname  = usePathname();
  const [user, setUser]         = useState<{ displayName: string } | null>(null);
  const [open, setOpen]         = useState(false);
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
      transition={{ duration: 0.40, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(247,245,242,0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.3s ease',
      }}
    >
      <div className="max-w-3xl mx-auto px-6 flex items-center justify-between" style={{ height: 56 }}>

        {/* Brand */}
        <Link href="/home" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <Heart size={12} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
          <span className="font-display" style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Our Verse
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center" style={{ gap: 2 }}>
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} style={{ textDecoration: 'none', position: 'relative', padding: '6px 16px', borderRadius: 999, fontSize: 12, color: active ? 'var(--text-primary)' : 'var(--text-faint)', transition: 'color 0.18s ease' }}>
                {active && (
                  <motion.span layoutId="nav-pill"
                    style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{l.label}</span>
              </Link>
            );
          })}
          <div style={{ width: 1, height: 12, background: 'var(--border)', margin: '0 8px' }} />
          <button
            onClick={() => { logout(); router.push('/'); }}
            title="Sign out"
            style={{ padding: 8, borderRadius: 999, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', transition: 'color 0.18s ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
          >
            <LogOut size={12} />
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex' }}
          className="md:hidden"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.20 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(247,245,242,0.96)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--border)' }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  style={{ padding: '12px 16px', borderRadius: 10, fontSize: 13, textDecoration: 'none', color: pathname === l.href ? 'var(--text-primary)' : 'var(--text-muted)', background: pathname === l.href ? 'var(--surface)' : 'transparent', transition: 'color 0.18s ease' }}
                >{l.label}</Link>
              ))}
              <button
                onClick={() => { logout(); router.push('/'); }}
                style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
              >Sign out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
