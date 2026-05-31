export const LIBRARY_IFRAME_TOKEN_CSS = `
  :root {
    --rt-space-1: 0.25rem;
    --rt-space-2: 0.5rem;
    --rt-space-3: 0.75rem;
    --rt-space-4: 1rem;
    --rt-space-6: 1.5rem;
    --rt-space-8: 2rem;
    --rt-radius-sm: 0.375rem;
    --rt-radius-md: 0.5rem;
    --rt-radius-lg: 0.75rem;
    --rt-radius-xl: 1rem;
    --rt-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --rt-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --rt-surface: 255 255 255;
    --rt-foreground: 15 23 42;
    --rt-muted: 100 116 139;
    --rt-accent: 79 70 229;
  }
  .dark {
    --rt-surface: 15 23 42;
    --rt-foreground: 248 250 252;
    --rt-muted: 148 163 184;
    --rt-accent: 129 140 248;
  }
`;

export const LIBRARY_TAILWIND_CDN_CONFIG = `
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          rt: {
            surface: 'rgb(var(--rt-surface) / <alpha-value>)',
            foreground: 'rgb(var(--rt-foreground) / <alpha-value>)',
            muted: 'rgb(var(--rt-muted) / <alpha-value>)',
            accent: 'rgb(var(--rt-accent) / <alpha-value>)',
          },
        },
      },
    },
  };
`;
