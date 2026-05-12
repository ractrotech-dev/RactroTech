'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  /** Short caption under the value (counts, status text) — not a fake percentage. */
  hint?: string;
  href?: string;
  accent?: 'yellow' | 'green' | 'blue' | 'red' | 'violet';
}

const accentMap = {
  yellow: {
    bar: 'bg-yellow-400',
    iconBg: 'bg-yellow-400',
  },
  green: {
    bar: 'bg-emerald-400',
    iconBg: 'bg-emerald-400',
  },
  blue: {
    bar: 'bg-blue-400',
    iconBg: 'bg-blue-400',
  },
  red: {
    bar: 'bg-red-400',
    iconBg: 'bg-red-400',
  },
  violet: {
    bar: 'bg-violet-400',
    iconBg: 'bg-violet-400',
  },
};

export default function StatCard({
  title,
  value,
  icon,
  hint,
  href,
  accent = 'yellow',
}: StatCardProps) {
  const colors = accentMap[accent];

  const content = (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden border-4 border-black bg-white/90 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm transition-shadow hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white/40 to-transparent opacity-90`} />
      <div className={`absolute left-0 right-0 top-0 h-1 ${colors.bar}`} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/45">{title}</p>
          <p className="text-3xl font-black leading-none tracking-tight text-black">{value}</p>
          {hint ? (
            <p className="text-[11px] font-bold uppercase tracking-wider text-black/50">{hint}</p>
          ) : null}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black ${colors.iconBg} text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
        >
          {icon}
        </div>
      </div>

      {href ? (
        <div className="relative mt-4 border-t-2 border-black/10 pt-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-black/35 transition-colors group-hover:text-black">
            Open →
          </span>
        </div>
      ) : null}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
