import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { typographyVariants, type TypographyVariant } from "@/lib/design-system"

type TypographyProps = {
  variant?: TypographyVariant
  as?: "h1" | "h2" | "h3" | "p" | "span"
  className?: string
  children: React.ReactNode
}

const defaultElement: Record<TypographyVariant, TypographyProps["as"]> = {
  display: "h1",
  heading: "h2",
  subheading: "h3",
  body: "p",
  caption: "span",
}

export function Typography({
  variant = "body",
  as,
  className,
  children,
}: TypographyProps) {
  const Comp = as ?? defaultElement[variant] ?? "p"
  return (
    <Comp className={cn(typographyVariants({ variant }), className)}>
      {children}
    </Comp>
  )
}

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 py-16 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-muted/50">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <Typography variant="heading" as="h3" className="text-base">
        {title}
      </Typography>
      {description && (
        <Typography variant="caption" className="max-w-sm">
          {description}
        </Typography>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
