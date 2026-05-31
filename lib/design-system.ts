import { cva, type VariantProps } from "class-variance-authority"

/** Semantic color tokens mapped in globals.css and tailwind.config.ts */
export const semanticColors = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "destructive",
] as const

export type SemanticColor = (typeof semanticColors)[number]

/** Spacing scale (px) — mobile-first layout rhythm */
export const spacingScale = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
} as const

/** Border radius tokens */
export const radiusScale = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
} as const

export const typographyVariants = cva("", {
  variants: {
    variant: {
      display:
        "scroll-m-20 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
      heading:
        "scroll-m-20 text-2xl font-semibold tracking-tight sm:text-3xl",
      subheading:
        "scroll-m-20 text-lg font-medium tracking-tight sm:text-xl text-muted-foreground",
      body: "text-sm leading-relaxed sm:text-base",
      caption: "text-xs text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

export type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>

export const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
