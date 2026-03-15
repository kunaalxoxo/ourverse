'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser, logout } from '@/lib/auth';
import { Heart, Home, Gift, PlusCircle, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ displayName: string; emoji: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const links = [
    { href: '/home', label: 'Home', icon: <Home size={16} /> },
    { href: '/coupons', label: 'Coupons', icon: <Gift size={16} /> },
    { href: '/add-coupon', label: 'Add Coupon', icon: <PlusCircle size={16} /> },
  ];

  if (!user) return null;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 group">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart size={20} className="text-pink-400 fill-pink-400" />
          </motion.div>
          <span className="font-script text-xl text-pink-300 group-hover:text-pink-200 transition-colors">
            Ourverse
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                pathname === l.href
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/5'
              }`}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-white/50">
            {user.emoji} {user.displayName}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white/60 hover:text-white"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 glass"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all ${
                    pathname === l.href
                      ? 'bg-pink-500/20 text-pink-300'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  {l.icon} {l.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 text-sm text-white/40 hover:text-white/70"
              >
                <LogOut size={16} /> Logout ({user.displayName})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
