'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  return (
    <motion.button
      onClick={() => router.back()}
      whileHover={{ x: -3 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'transparent',
        border: '1px solid #1e2330',
        borderRadius: '8px',
        color: '#4a5568',
        padding: '8px 14px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'color 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#6c63ff';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = '#4a5568';
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e2330';
      }}
    >
      <ArrowLeft size={14} /> Back
    </motion.button>
  );
}
