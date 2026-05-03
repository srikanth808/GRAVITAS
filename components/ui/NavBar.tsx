'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { LogOut, Shield } from 'lucide-react';

interface NavBarProps {
  userEmail?: string;
}

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/upload', label: 'Upload' },
];

export default function NavBar({ userEmail }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: '#111318',
        borderBottom: '1px solid #1e2330',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={20} color="#6c63ff" />
        <span
          style={{
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontSize: '16px',
          }}
        >
          <span style={{ color: '#00d4ff' }}>GRAVI</span>
          <span style={{ color: '#6c63ff' }}>TAS</span>
        </span>
      </Link>

      {/* Center nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {NAV_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                position: 'relative',
                padding: '6px 16px',
                textDecoration: 'none',
                color: isActive ? '#e2e8f0' : '#4a5568',
                fontWeight: isActive ? 600 : 400,
                fontSize: '14px',
                borderRadius: '6px',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: '10%',
                      right: '10%',
                      height: '2px',
                      background: 'linear-gradient(90deg, #6c63ff, #00d4ff)',
                      borderRadius: '2px',
                    }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Right: user + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {userEmail && (
          <span style={{ color: '#4a5568', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userEmail}
          </span>
        )}
        <motion.button
          onClick={handleLogout}
          whileHover={{ borderColor: '#ff4444', color: '#ff4444' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'transparent',
            border: '1px solid #1e2330',
            borderRadius: '6px',
            color: '#4a5568',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          <LogOut size={14} />
          Logout
        </motion.button>
      </div>
    </nav>
  );
}
