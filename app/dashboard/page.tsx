'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import IncidentTable from '@/components/ui/IncidentTable';
import CrimeDonut from '@/components/charts/CrimeDonut';
import SeverityBar from '@/components/charts/SeverityBar';
import type { Incident, StatsResponse } from '@/lib/types';
import { Plus, Search, ChevronDown } from 'lucide-react';

const SEVERITY_OPTIONS = ['', 'Critical', 'High', 'Medium', 'Low'];
const STATUS_OPTIONS = ['', 'Open', 'Under Investigation', 'Closed'];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') ?? '';
  const severity = searchParams.get('severity') ?? '';
  const status = searchParams.get('status') ?? '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`/dashboard?${params.toString()}`);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (severity) params.set('severity', severity);
      if (status) params.set('status', status);

      const [incRes, statsRes] = await Promise.all([
        fetch(`/api/incidents?${params.toString()}`),
        fetch('/api/stats'),
      ]);

      if (incRes.ok) {
        const d = await incRes.json();
        setIncidents(d.incidents ?? []);
      }
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } finally {
      setLoading(false);
    }
  }, [search, severity, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const inputStyle: React.CSSProperties = {
    background: '#111318',
    border: '1px solid #1e2330',
    borderRadius: '8px',
    color: '#e2e8f0',
    padding: '8px 12px',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#e2e8f0' }}>
            Incident Dashboard
          </h1>
          <p style={{ margin: '4px 0 0', color: '#4a5568', fontSize: '14px' }}>
            AI-powered crime incident analysis
          </p>
        </div>
        <Link href="/upload">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(108,99,255,0.3)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#6c63ff',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> New Report
          </motion.button>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <StatCard label="Total Incidents" value={stats?.total ?? 0} icon="total" />
        <StatCard label="Critical" value={stats?.critical ?? 0} icon="critical" />
        <StatCard label="Open Cases" value={stats?.open ?? 0} icon="open" />
        <StatCard label="This Week" value={stats?.this_week ?? 0} icon="week" />
      </div>

      {/* Charts */}
      {stats && (stats.by_crime.length > 0 || stats.by_severity.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ background: '#111318', border: '1px solid #1e2330', borderRadius: '12px', padding: '20px 24px' }}
          >
            <h2 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Crime Type Breakdown
            </h2>
            {stats.by_crime.length > 0
              ? <CrimeDonut data={stats.by_crime} />
              : <p style={{ color: '#4a5568', textAlign: 'center', padding: '40px 0' }}>No data yet</p>
            }
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{ background: '#111318', border: '1px solid #1e2330', borderRadius: '12px', padding: '20px 24px' }}
          >
            <h2 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Severity Distribution
            </h2>
            {stats.by_severity.length > 0
              ? <SeverityBar data={stats.by_severity} />
              : <p style={{ color: '#4a5568', textAlign: 'center', padding: '40px 0' }}>No data yet</p>
            }
          </motion.div>
        </div>
      )}

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: '#111318',
          border: '1px solid #1e2330',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '12px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={14} color="#4a5568" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search incident text..."
            defaultValue={search}
            onChange={(e) => {
              const val = e.target.value;
              setTimeout(() => updateParam('search', val), 400);
            }}
            style={{ ...inputStyle, paddingLeft: '32px', width: '100%', boxSizing: 'border-box' }}
            onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
            onBlur={(e) => (e.target.style.borderColor = '#1e2330')}
          />
        </div>

        {/* Severity */}
        <div style={{ position: 'relative' }}>
          <select
            value={severity}
            onChange={(e) => updateParam('severity', e.target.value)}
            style={{ ...inputStyle, appearance: 'none', paddingRight: '32px', minWidth: '140px' }}
          >
            {SEVERITY_OPTIONS.map((s) => (
              <option key={s} value={s}>{s || 'All Severities'}</option>
            ))}
          </select>
          <ChevronDown size={14} color="#4a5568" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>

        {/* Status */}
        <div style={{ position: 'relative' }}>
          <select
            value={status}
            onChange={(e) => updateParam('status', e.target.value)}
            style={{ ...inputStyle, appearance: 'none', paddingRight: '32px', minWidth: '160px' }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s || 'All Statuses'}</option>
            ))}
          </select>
          <ChevronDown size={14} color="#4a5568" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>

        {(search || severity || status) && (
          <button
            onClick={() => router.replace('/dashboard')}
            style={{ ...inputStyle, color: '#ff4444', borderColor: 'rgba(255,68,68,0.3)', whiteSpace: 'nowrap', cursor: 'pointer' }}
          >
            Clear filters
          </button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{ background: '#111318', border: '1px solid #1e2330', borderRadius: '12px', overflow: 'hidden' }}
      >
        {loading
          ? <div style={{ padding: '60px', textAlign: 'center', color: '#4a5568' }}>Loading incidents...</div>
          : <IncidentTable incidents={incidents} />
        }
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#4a5568' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
