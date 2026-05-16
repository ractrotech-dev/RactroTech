const MAX_LEN = 4000;

/** Strip angle-bracket tags and collapse whitespace for safe display/storage. */
export function sanitizeReviewText(input: string): string {
  const stripped = input.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  const collapsed = stripped.replace(/\s+/g, ' ').trim();
  return collapsed.slice(0, MAX_LEN);
}

export function sanitizeName(input: string, max = 120): string {
  return input.replace(/<[^>]*>/g, '').trim().slice(0, max);
}
