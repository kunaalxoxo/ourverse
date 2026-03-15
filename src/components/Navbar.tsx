'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser, logout } from '@/lib/auth';
import { Heart, Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ displayName: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setUser(getStoredUser()); }, [pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (!user) return null;

  const links = [
    { href: '/home', label: 'Home' },
    { href: '/coupons', label: 'Coupons' },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2.5 group">
          <motion.span
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={15} className="text-[#FFB3C6] fill-[#FFB3C6]" />
          </motion.span>
          <span className="font-display text-[15px] tracking-wide text-white/80 group-hover:text-white transition-colors">
            Our Verse
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-1.5 rounded-full text-[13px] transition-all duration-300 ${
                pathname === l.href
                  ? 'text-[#FFB3C6] bg-[#FFB3C6]/10'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="ml-2 p-2 text-white/20 hover:text-white/50 transition-colors rounded-full"
          >
            <LogOut size={14} />
          </button>
        </nav>

        {/* Mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white/40">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm ${
                    pathname === l.href ? 'text-[#FFB3C6]' : 'text-white/40'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="px-4 py-3 text-left text-sm text-white/25"
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
