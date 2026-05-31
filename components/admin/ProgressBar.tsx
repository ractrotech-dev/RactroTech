'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'bg-yellow-400',
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-[9px] font-black tracking-wider text-black/40">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-[10px] font-black text-black/60">{percentage}%</span>
          )}
        </div>
      )}
      <div className="h-3 w-full border-2 border-black bg-gray-100">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
