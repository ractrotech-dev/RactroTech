export type { SemanticColor, TypographyVariant } from "@/lib/design-system"

export type NavItem = {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}

export type BreadcrumbItem = {
  label: string
  href?: string
}
