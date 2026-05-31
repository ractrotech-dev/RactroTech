export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

export function validateComponentHtml(html: string, category: string): ValidationResult {
  const errors: string[] = [];

  if (!html.trim()) {
    errors.push('Empty HTML');
  }

  if (/style\s*=/.test(html)) {
    errors.push('Inline styles are not allowed');
  }

  const withoutClassAttrs = html.replace(/class="[^"]*"/g, '');
  if (/#[0-9a-fA-F]{3,8}\b/.test(withoutClassAttrs) || /rgb\s*\(/i.test(withoutClassAttrs)) {
    errors.push('Hardcoded color values detected outside utility classes');
  }

  const interactive = [
    ...Array.from(html.matchAll(/<(button|input|select|textarea)\b[^>]*>/gi)),
    ...Array.from(html.matchAll(/<a\s[^>]*>/gi)),
  ].map((m) => m[0]);

  for (const tag of interactive) {
    if (!/focus-visible:ring|focus:ring/.test(tag) && !/<input[^>]*type="hidden"/i.test(tag)) {
      if (tag.startsWith('<button') || tag.startsWith('<a') || tag.startsWith('<input')) {
        errors.push(`Missing focus ring on interactive element: ${tag.slice(0, 40)}`);
      }
    }
  }

  if (!/\b(sm:|md:|lg:)/.test(html)) {
    errors.push('Missing responsive breakpoint classes');
  }

  const cardCategories = ['Buttons', 'Cards', 'CTAs', 'Forms', 'Notifications'];
  if (cardCategories.includes(category) && html.includes('min-h-screen')) {
    errors.push('Avoid min-h-screen in compact preview components');
  }

  if (/<button[^>]*>/.test(html) && !/<button[^>]*aria-label|<button[^>]*>[^<]+/.test(html)) {
    const iconOnly = /<button[^>]*>\s*<svg/i.test(html);
    if (iconOnly && !/aria-label=/.test(html)) {
      errors.push('Icon button missing aria-label');
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
