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
    { href: '/home',    label: 'Home' },
    { href: '/coupons', label: 'Coupons' },
  ];

  /* Obsidian Warm accent colour shorthand */
  const cream = 'rgba(232,213,176,';

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={scrolled ? { borderColor: `${cream}0.07)` } : undefined}
    >
      <div className="max-w-4xl mx-auto px-6 h-[60px] flex items-center justify-between">

        {/* Brand */}
        <Link href="/home" className="flex items-center gap-2 group">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Obsidian Warm: cream-gold heart */}
            <Heart size={13} style={{ color: '#E8D5B0', fill: '#E8D5B0' }} />
          </motion.span>
          <span
            className="font-display text-[14px] tracking-wide transition-colors duration-300"
            style={{ color: `${cream}0.72)` }}
          >
            Our Verse
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="relative px-4 py-1.5 text-[12.5px] rounded-full transition-colors duration-300"
                style={{ color: active ? `${cream}0.88)` : `${cream}0.32)` }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `${cream}0.08)`,
                      border: `1px solid ${cream}0.16)`,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}

          {/* Separator */}
          <div className="w-px h-3 mx-2" style={{ background: `${cream}0.10)` }} />

          <button
            onClick={() => { logout(); router.push('/'); }}
            className="p-2 rounded-full transition-colors"
            style={{ color: `${cream}0.22)` }}
            onMouseEnter={e => (e.currentTarget.style.color = `${cream}0.55)`)}
            onMouseLeave={e => (e.currentTarget.style.color = `${cream}0.22)`)}
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden transition-colors"
          style={{ color: `${cream}0.38)` }}
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
            className="md:hidden overflow-hidden glass"
            style={{ borderTop: `1px solid ${cream}0.06)` }}
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {links.map(l => (
                <Link
                  key={l.href} href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-[13px] transition-colors"
                  style={{ color: pathname === l.href ? `${cream}0.88)` : `${cream}0.35)` }}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="px-4 py-3 text-left text-[12px] mt-1"
                style={{ color: `${cream}0.22)` }}
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
