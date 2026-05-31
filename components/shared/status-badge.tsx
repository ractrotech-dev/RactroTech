import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { statusBadgeVariants } from "@/lib/design-system"

type StatusBadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusBadgeVariants>

export function StatusBadge({
  className,
  variant,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)} {...props} />
  )
}
