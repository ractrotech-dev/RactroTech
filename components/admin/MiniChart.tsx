'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatCount } from '@/lib/admin/format';

interface MiniChartProps {
  data: { name: string; value: number }[];
  title: string;
  subtitle?: string;
  /** Line colour. Defaults to the admin accent. */
  color?: string;
  /** Shown big above the chart, e.g. the period total. Defaults to the sum of `data`. */
  total?: number | null;
  totalLabel?: string;
}

const slug = (s: string) => s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'chart';

/**
 * A small area chart with its headline number. Counts are whole numbers, so the axis never
 * shows fractions, and the chart only measures itself after mount — ResponsiveContainer has
 * no size during server rendering, which is what produced the width(-1) warnings.
 */
export default function MiniChart({ data, title, subtitle, color = 'rgb(var(--mkt-violet))', total, totalLabel = 'Total' }: MiniChartProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const gid = `chart-${slug(title)}`;
  const sum = total === undefined ? data.reduce((acc, d) => acc + (Number(d.value) || 0), 0) : total;

  return (
    <section className="rounded-2xl border border-mkt-line bg-mkt-surface p-5 text-mkt-ink">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold leading-6">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-[13px] leading-5 text-mkt-muted">{subtitle}</p> : null}
        </div>
        <div className="text-right">
          <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{formatCount(sum)}</p>
          <p className="mt-1 text-[12px] text-mkt-muted">{totalLabel}</p>
        </div>
      </div>

      <div className="mt-5 h-44 min-w-0">
        {ready ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgb(var(--mkt-line))" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: 'rgb(var(--mkt-muted))' }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: 'rgb(var(--mkt-muted))' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                cursor={{ stroke: 'rgb(var(--mkt-line))' }}
                formatter={(v) => [formatCount(Number(v)), totalLabel === 'Total' ? 'Count' : totalLabel]}
                contentStyle={{
                  background: 'rgb(var(--mkt-surface))',
                  border: '1px solid rgb(var(--mkt-line))',
                  borderRadius: 10,
                  fontSize: 13,
                  color: 'rgb(var(--mkt-ink))',
                  boxShadow: '0 8px 24px -12px rgb(11 11 16 / 0.25)',
                }}
                labelStyle={{ color: 'rgb(var(--mkt-muted))', marginBottom: 2 }}
              />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gid})`} dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full rounded-lg bg-mkt-ink/[0.03]" aria-hidden />
        )}
      </div>
    </section>
  );
}
