'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { TrendingUp, AlertTriangle, FolderOpen, Clock } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: 'total' | 'critical' | 'open' | 'week';
  accent?: string;
}

const ICONS = {
  total: TrendingUp,
  critical: AlertTriangle,
  open: FolderOpen,
  week: Clock,
};

const COLORS = {
  total: '#6c63ff',
  critical: '#ff4444',
  open: '#00d4ff',
  week: '#f6c90e',
};

export default function StatCard({ label, value, icon, accent }: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const Icon = ICONS[icon];
  const color = accent ?? COLORS[icon];

  useEffect(() => {
    const ctrl = animate(count, value, { duration: 1.2, ease: 'easeOut' });
    return ctrl.stop;
  }, [value, count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: `0 8px 30px ${color}22` }}
      style={{
        background: '#111318',
        border: `1px solid #1e2330`,
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'box-shadow 0.2s',
        cursor: 'default',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#4a5568', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={18} color={color} />
        </div>
      </div>
      <motion.span
        style={{
          fontSize: '36px',
          fontWeight: 800,
          color,
          lineHeight: 1,
        }}
      >
        {rounded}
      </motion.span>
    </motion.div>
  );
}
