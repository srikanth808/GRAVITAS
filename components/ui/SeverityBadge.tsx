'use client';

import { motion } from 'framer-motion';
import type { Severity } from '@/lib/types';

interface SeverityBadgeProps {
  severity: Severity;
}

const CONFIGS: Record<Severity, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'rgba(255,68,68,0.12)', text: '#ff4444', border: '#ff4444' },
  High:     { bg: 'rgba(255,140,0,0.12)', text: '#ff8c00', border: '#ff8c00' },
  Medium:   { bg: 'rgba(246,201,14,0.12)', text: '#f6c90e', border: '#f6c90e' },
  Low:      { bg: 'rgba(0,230,118,0.12)', text: '#00e676', border: '#00e676' },
};

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const cfg = CONFIGS[severity];

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    background: cfg.bg,
    color: cfg.text,
    border: `1px solid ${cfg.border}`,
    whiteSpace: 'nowrap',
  };

  if (severity === 'Critical') {
    return (
      <motion.span
        style={badgeStyle}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        {severity}
      </motion.span>
    );
  }

  if (severity === 'High') {
    return (
      <motion.span
        style={badgeStyle}
        animate={{ opacity: [1, 0.65, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        {severity}
      </motion.span>
    );
  }

  return <span style={badgeStyle}>{severity}</span>;
}
