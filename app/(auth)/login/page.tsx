'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (signUpError) throw signUpError;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: '#0a0c10',
    border: '1px solid #1e2330',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#111318',
          border: '1px solid #1e2330',
          borderRadius: '20px',
          padding: '40px 36px',
          boxShadow: '0 24px 80px rgba(108,99,255,0.12)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(108,99,255,0.3)' }}>
              <Shield size={24} color="#6c63ff" />
            </div>
          </div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: '24px', letterSpacing: '0.15em' }}>
            <span style={{ color: '#00d4ff' }}>GRAVI</span>
            <span style={{ color: '#6c63ff' }}>TAS</span>
          </h1>
          <p style={{ margin: '6px 0 0', color: '#4a5568', fontSize: '13px' }}>
            Crime Intelligence Platform
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#0a0c10',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '28px',
            position: 'relative',
          }}
        >
          {(['login', 'register'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: tab === t ? '#e2e8f0' : '#4a5568',
                fontSize: '14px',
                fontWeight: tab === t ? 600 : 400,
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
                transition: 'color 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
          <motion.div
            layoutId="tab-indicator"
            style={{
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              width: 'calc(50% - 4px)',
              background: '#111318',
              borderRadius: '7px',
              border: '1px solid #1e2330',
              left: tab === 'login' ? '4px' : '50%',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <AnimatePresence>
            {tab === 'register' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{ display: 'block', color: '#4a5568', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={tab === 'register'}
                  placeholder="John Analyst"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
                  onBlur={(e) => (e.target.style.borderColor = '#1e2330')}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label style={{ display: 'block', color: '#4a5568', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="analyst@gravitas.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
              onBlur={(e) => (e.target.style.borderColor = '#1e2330')}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#4a5568', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
              onBlur={(e) => (e.target.style.borderColor = '#1e2330')}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'rgba(255,68,68,0.08)',
                  border: '1px solid rgba(255,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#ff4444',
                  fontSize: '13px',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ opacity: loading ? 1 : 0.9 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#3a3460' : '#6c63ff',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
