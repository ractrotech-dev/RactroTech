'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type StarRatingInputProps = {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
  error?: boolean;
};

export function StarRatingInput({ value, onChange, disabled, error }: StarRatingInputProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 rounded border-2 border-dashed border-black/15 bg-yellow-50/50 p-2',
        error && 'border-red-500 bg-red-50',
      )}
      role="group"
      aria-label="Star rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => onChange(n)}
          className="rounded border-2 border-transparent p-0.5 transition-transform hover:scale-110 hover:border-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-40"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          aria-pressed={value === n}
        >
          <Star
            className={cn(
              'h-8 w-8 sm:h-9 sm:w-9',
              display >= n ? 'fill-yellow-400 text-black' : 'fill-black/5 text-black/25',
            )}
            strokeWidth={2}
          />
        </button>
      ))}
    </div>
  );
}
