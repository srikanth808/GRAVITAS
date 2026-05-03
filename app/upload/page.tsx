'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DropZone from '@/components/ui/DropZone';
import StatCard from '@/components/ui/StatCard';
import NavBar from '@/components/ui/NavBar';
import type { StatsResponse } from '@/lib/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function UploadPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
      setUserEmail(data.user?.email);
    });
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, [supabase]);

  return (
    <div>
      <NavBar userEmail={userEmail} />
      <div style={{ paddingTop: '60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '36px' }}
          >
            <p style={{ margin: 0, color: '#6c63ff', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Incident Intake System
            </p>
            <h1 style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 800, color: '#e2e8f0' }}>
              Upload FIR Report
            </h1>
            <p style={{ margin: '8px 0 0', color: '#4a5568', fontSize: '14px', maxWidth: '480px' }}>
              Drop a PDF First Information Report to automatically classify the crime type, severity, and extract key entities.
            </p>
          </motion.div>

          {/* DropZone */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: '40px' }}
          >
            <DropZone />
          </motion.div>

          {/* Quick stats below */}
          {stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p style={{ margin: '0 0 16px', color: '#4a5568', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Current Statistics
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <StatCard label="Total Incidents" value={stats.total} icon="total" />
                <StatCard label="Critical" value={stats.critical} icon="critical" />
                <StatCard label="Open Cases" value={stats.open} icon="open" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
