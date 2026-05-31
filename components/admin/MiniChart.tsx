'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MiniChartProps {
  data: { name: string; value: number }[];
  title: string;
  subtitle?: string;
  color?: string;
}

const slug = (s: string) =>
  s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'chart';

export default function MiniChart({ data, title, subtitle, color = '#facc15' }: MiniChartProps) {
  const gid = slug(title);
  return (
    <div className="relative overflow-hidden border-4 border-black bg-white/90 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-yellow-50/20 to-transparent" />
      <div className="relative mb-4">
        <h3 className="text-[10px] font-black tracking-[0.2em] text-black/50">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-[9px] font-semibold leading-snug tracking-wider text-black/35">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="relative z-10 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${gid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: '3px solid #000',
                borderRadius: 0,
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              fill={`url(#gradient-${gid})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
