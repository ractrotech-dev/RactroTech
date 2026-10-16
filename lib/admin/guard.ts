import 'server-only';

import { getClientIp } from '@/lib/auth/client-ip';
import { logSecurityEvent } from '@/lib/security/logger';
import { checkAdminActionRateLimit } from '@/lib/security/rate-limit';
import { getAdminUser } from '@/utils/admin';
import { db } from '@/utils/db/db';
import { activityLogsTable } from '@/utils/db/schema';

/**
 * Guards for admin server actions. They live here, not in an action file, because every export
 * of a 'use server' module is callable from the browser.
 */

/** The signed-in admin, or throws. Call first in every admin server action. */
export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) throw new Error('Unauthorized');

  const ip = getClientIp();
  if (!checkAdminActionRateLimit(ip, admin.id)) {
    logSecurityEvent({ type: 'rate_limit', ip, path: '/admin', action: 'admin_action' });
    throw new Error('Too many requests. Please slow down.');
  }

  return admin;
}

/** Records a mutation in the audit trail (Admin → Audit). Never throws. */
export async function logActivity(userId: string, action: string, entityType: string, entityId?: string) {
  try {
    await db.insert(activityLogsTable).values({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
    });
  } catch {
    // Silently fail if table doesn't exist yet
  }
}
