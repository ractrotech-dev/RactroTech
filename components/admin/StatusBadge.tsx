'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  variant?: 'inquiry' | 'project' | 'client' | 'task' | 'priority'
}

const statusColors: Record<string, string> = {
  new: 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  in_progress: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  responded: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  converted: 'border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  closed: 'border-border bg-muted text-muted-foreground',
  draft: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  published: 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  archived: 'border-border bg-muted text-muted-foreground',
  planning: 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  review: 'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  deployed: 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  completed: 'border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  on_hold: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  cancelled: 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  todo: 'border-border bg-muted text-muted-foreground',
  done: 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  lead: 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  onboarding: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  active: 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  inactive: 'border-border bg-muted text-muted-foreground',
  churned: 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  low: 'border-border bg-muted text-muted-foreground',
  medium: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  high: 'border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  urgent: 'border-red-500 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  critical: 'border-red-600 bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200',
}

function formatLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-sm text-[9px] font-semibold tracking-wider',
        statusColors[status] ?? 'border-border bg-muted text-muted-foreground'
      )}
    >
      {formatLabel(status)}
    </Badge>
  )
}
