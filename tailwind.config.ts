import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        journal: {
          bg: "hsl(var(--journal-bg))",
          line: "hsl(var(--journal-line))",
          surface: "hsl(var(--journal-surface))",
          ink: "hsl(var(--journal-ink-muted))",
        },
        rt: {
          surface: "rgb(var(--rt-surface) / <alpha-value>)",
          foreground: "rgb(var(--rt-foreground) / <alpha-value>)",
          muted: "rgb(var(--rt-muted) / <alpha-value>)",
          accent: "rgb(var(--rt-accent) / <alpha-value>)",
        },
        /* Marketing landing palette. Defined as space-separated RGB channels in
           globals.css so `.dark` can re-point them, and consumed through rgb() here
           so opacity modifiers like `bg-mkt-ink/10` still resolve correctly.

           Roles matter when picking one of these:
             surface / surface-2  page and raised-card backgrounds — flip with the theme
             contrast / -soft     bands that are dark in BOTH themes (footer, CTA)
             ink / muted / line   foreground and hairlines — flip with the theme
             pastels              fills that carry foreground text — flip with it too
             violet / brand       brand accents — same hue, lifted in dark */
        mkt: {
          surface: "rgb(var(--mkt-surface) / <alpha-value>)",
          "surface-2": "rgb(var(--mkt-surface-2) / <alpha-value>)",
          contrast: "rgb(var(--mkt-contrast) / <alpha-value>)",
          "contrast-soft": "rgb(var(--mkt-contrast-soft) / <alpha-value>)",
          ink: "rgb(var(--mkt-ink) / <alpha-value>)",
          "ink-soft": "rgb(var(--mkt-ink-soft) / <alpha-value>)",
          "ink-line": "rgb(var(--mkt-ink-line) / <alpha-value>)",
          muted: "rgb(var(--mkt-muted) / <alpha-value>)",
          brand: "rgb(var(--mkt-brand) / <alpha-value>)",
          violet: "rgb(var(--mkt-violet) / <alpha-value>)",
          "violet-soft": "rgb(var(--mkt-violet-soft) / <alpha-value>)",
          "violet-deep": "rgb(var(--mkt-violet-deep) / <alpha-value>)",
          lavender: "rgb(var(--mkt-lavender) / <alpha-value>)",
          "lavender-deep": "rgb(var(--mkt-lavender-deep) / <alpha-value>)",
          cream: "rgb(var(--mkt-cream) / <alpha-value>)",
          line: "rgb(var(--mkt-line) / <alpha-value>)",
          dot: "rgb(var(--mkt-dot) / <alpha-value>)",
          mint: "rgb(var(--mkt-mint) / <alpha-value>)",
          pink: "rgb(var(--mkt-pink) / <alpha-value>)",
          butter: "rgb(var(--mkt-butter) / <alpha-value>)",
          lilac: "rgb(var(--mkt-lilac) / <alpha-value>)",
          sky: "rgb(var(--mkt-sky) / <alpha-value>)",
          success: "rgb(var(--mkt-success) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      spacing: {
        "ds-1": "var(--space-1)",
        "ds-2": "var(--space-2)",
        "ds-3": "var(--space-3)",
        "ds-4": "var(--space-4)",
        "ds-6": "var(--space-6)",
        "ds-8": "var(--space-8)",
        "ds-12": "var(--space-12)",
        "ds-16": "var(--space-16)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config