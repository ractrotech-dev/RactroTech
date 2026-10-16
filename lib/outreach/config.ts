import 'server-only';

import { getSiteUrl } from '@/lib/seo';

/**
 * Origin used in outgoing email (unsubscribe links) and the Gmail OAuth redirect.
 * Set OUTREACH_APP_URL=http://localhost:3000 locally; production falls back to the site URL.
 */
export function outreachBaseUrl() {
  return (process.env.OUTREACH_APP_URL || getSiteUrl()).replace(/\/$/, '');
}

export function dailySendLimit() {
  return Number(process.env.DAILY_SEND_LIMIT ?? 50);
}

export function batchSize() {
  return Number(process.env.BATCH_SIZE ?? 10);
}

export const smtpConfigured = () => Boolean(process.env.SMTP_HOST);
