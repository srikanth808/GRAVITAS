'use client';

import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CrimeDonutProps {
  data: { crime_type: string; count: number }[];
}

const COLORS = [
  '#6c63ff', '#00d4ff', '#ff4444', '#ff8c00',
  '#f6c90e', '#00e676', '#b388ff', '#80deea',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomLegend = (props: any) => {
  const payload: Array<{ value: string; color: string }> = props.payload ?? [];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 20px', marginTop: '12px' }}>
      {payload.map((entry) => (
        <div key={String(entry.value)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: String(entry.color), flexShrink: 0 }} />
          <span style={{ color: '#4a5568', fontSize: '12px' }}>{String(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
}) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#111318', border: '1px solid #1e2330', borderRadius: '8px', padding: '8px 14px' }}>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{payload[0].name}</p>
        <p style={{ margin: '4px 0 0', color: payload[0].fill, fontSize: '20px', fontWeight: 700 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function CrimeDonut({ data }: CrimeDonutProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height: '300px', position: 'relative' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="crime_type"
            cx="50%"
            cy="45%"
            innerRadius="52%"
            outerRadius="72%"
            paddingAngle={3}
            isAnimationActive
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderCustomLegend} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>{total}</div>
        <div style={{ fontSize: '11px', color: '#4a5568', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</div>
      </div>
    </motion.div>
  );
}
