import { LIBRARY_IFRAME_TOKEN_CSS, LIBRARY_TAILWIND_CDN_CONFIG } from '@/lib/component-library/iframe-tokens';

type BuildSrcDocOptions = {
  darkMode?: boolean;
};

export function buildSrcDoc(html: string, options: BuildSrcDocOptions = {}): string {
  const darkClass = options.darkMode ? ' class="dark"' : '';

  return `<!doctype html>
<html lang="en"${darkClass}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
    <script>${LIBRARY_TAILWIND_CDN_CONFIG}</script>
    <style>
      html, body { margin: 0; padding: 0; min-height: 100%; }
      ${LIBRARY_IFRAME_TOKEN_CSS}
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>`;
}

export function getFrameWidthClass(device: 'mobile' | 'tablet' | 'desktop'): string {
  if (device === 'mobile') return 'w-[375px] max-w-full';
  if (device === 'tablet') return 'w-[768px] max-w-full';
  return 'w-full';
}
