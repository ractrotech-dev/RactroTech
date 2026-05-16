'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type GreetingSegment = { emoji: string; label: string }

function getGreetingForHour(hour: number): GreetingSegment {
  if (hour >= 21 || hour < 5) return { emoji: '🌙', label: 'Good Night' }
  if (hour < 12) return { emoji: '🌅', label: 'Good Morning' }
  if (hour < 17) return { emoji: '☀️', label: 'Good Afternoon' }
  return { emoji: '🌆', label: 'Good Evening' }
}

type DashboardHeaderGreetingProps = {
  displayName: string
  className?: string
}

export function DashboardHeaderGreeting({
  displayName,
  className,
}: DashboardHeaderGreetingProps) {
  const [mounted, setMounted] = useState(false)
  const [segment, setSegment] = useState<GreetingSegment>(() =>
    getGreetingForHour(new Date().getHours()),
  )

  useEffect(() => {
    const tick = () => {
      setSegment(getGreetingForHour(new Date().getHours()))
    }
    tick()
    setMounted(true)
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <p
      className={cn(
        'min-w-0 truncate text-center text-sm font-medium text-foreground md:text-left md:text-base',
        mounted && 'animate-in fade-in duration-500',
        className,
      )}
      suppressHydrationWarning
    >
      <span className="mr-1.5" aria-hidden>
        {segment.emoji}
      </span>
      {segment.label}, {displayName}{' '}
      <span aria-hidden>👋</span>
    </p>
  )
}
