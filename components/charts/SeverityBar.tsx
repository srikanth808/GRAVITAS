'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

interface SeverityBarProps {
  data: { severity: string; count: number }[];
}

const SEVERITY_ORDER = ['Critical', 'High', 'Medium', 'Low'];
const SEVERITY_COLORS: Record<string, string> = {
  Critical: '#ff4444',
  High: '#ff8c00',
  Medium: '#f6c90e',
  Low: '#00e676',
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    const color = SEVERITY_COLORS[label ?? ''] ?? '#6c63ff';
    return (
      <div style={{ background: '#111318', border: '1px solid #1e2330', borderRadius: '8px', padding: '8px 14px' }}>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{label}</p>
        <p style={{ margin: '4px 0 0', color, fontSize: '20px', fontWeight: 700 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function SeverityBar({ data }: SeverityBarProps) {
  // Sort by predefined order
  const sorted = SEVERITY_ORDER.map((sev) => {
    const found = data.find((d) => d.severity === sev);
    return { severity: sev, count: found?.count ?? 0 };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height: '260px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} barCategoryGap="35%">
          <CartesianGrid vertical={false} stroke="#1e2330" strokeDasharray="0" />
          <XAxis
            dataKey="severity"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4a5568', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4a5568', fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.06)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive animationBegin={0} animationDuration={800}>
            {sorted.map((entry) => (
              <Cell
                key={entry.severity}
                fill={SEVERITY_COLORS[entry.severity] ?? '#6c63ff'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
