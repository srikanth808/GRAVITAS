'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Incident } from '@/lib/types';
import SeverityBadge from './SeverityBadge';
import { ExternalLink, UploadCloud } from 'lucide-react';
import Link from 'next/link';

interface IncidentTableProps {
  incidents: Incident[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const STATUS_COLOR: Record<string, string> = {
  Open: '#00d4ff',
  'Under Investigation': '#f6c90e',
  Closed: '#4a5568',
};

export default function IncidentTable({ incidents }: IncidentTableProps) {
  const router = useRouter();

  if (incidents.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          color: '#4a5568',
          gap: '16px',
        }}
      >
        <UploadCloud size={48} color="#1e2330" />
        <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>No incidents found</p>
        <p style={{ margin: 0, fontSize: '13px' }}>
          Upload a FIR report to get started.{' '}
          <Link href="/upload" style={{ color: '#6c63ff', textDecoration: 'underline' }}>
            Upload now →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <motion.table
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          fontSize: '13px',
        }}
      >
        <thead>
          <tr style={{ color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '11px' }}>
            {['File', 'Crime Type', 'Severity', 'Location', 'Date', 'Status', 'View'].map(
              (col) => (
                <th
                  key={col}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    borderBottom: '1px solid #1e2330',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <motion.tr
              key={inc.id}
              variants={rowVariants}
              onClick={() => router.push(`/incident/${inc.id}`)}
              style={{ cursor: 'pointer' }}
              whileHover={{ backgroundColor: 'rgba(108,99,255,0.04)' }}
            >
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2330', color: '#e2e8f0', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {inc.original_filename ?? '—'}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2330', color: '#6c63ff', fontWeight: 500 }}>
                {inc.crime_type}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2330' }}>
                <SeverityBadge severity={inc.severity} />
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2330', color: '#4a5568', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {inc.location_text ?? '—'}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2330', color: '#4a5568', whiteSpace: 'nowrap' }}>
                {inc.incident_date ?? '—'}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2330' }}>
                <span style={{ color: STATUS_COLOR[inc.status] ?? '#4a5568', fontWeight: 500 }}>
                  {inc.status}
                </span>
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2330' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={`/incident/${inc.id}`}
                  style={{
                    color: '#00d4ff',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 500,
                  }}
                  className="hover:underline"
                >
                  View <ExternalLink size={12} />
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}
