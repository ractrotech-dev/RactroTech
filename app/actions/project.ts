'use server';

import 'server-only';

import { revalidatePath } from 'next/cache';
import { db } from '@/utils/db/db';
import { projectEnquiriesTable } from '@/utils/db/schema';
import { getClientIp } from '@/lib/auth/client-ip';
import { logSecurityEvent } from '@/lib/security/logger';
import { checkEnquiryRateLimit } from '@/lib/security/rate-limit';
import { projectEnquirySchema } from '@/lib/validation/schemas';
import { sanitizePlainText } from '@/lib/validation/sanitize';

export async function submitProjectEnquiry(
  prevState: { message: string; success: boolean },
  formData: FormData,
) {
  const ip = getClientIp();
  if (!checkEnquiryRateLimit(ip)) {
    logSecurityEvent({ type: 'rate_limit', ip, path: 'enquiry', action: 'submitProjectEnquiry' });
    return { message: 'Too many submissions. Please try again later.', success: false };
  }

  const raw = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    projectType: String(formData.get('projectType') ?? ''),
    description: String(formData.get('description') ?? ''),
  };

  const parsed = projectEnquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? 'Please check your input and try again.',
      success: false,
    };
  }

  const enquiry = {
    name: sanitizePlainText(parsed.data.name, 120),
    phone: parsed.data.phone,
    email: parsed.data.email ?? null,
    project_type: sanitizePlainText(parsed.data.projectType, 80),
    description: sanitizePlainText(parsed.data.description, 5000),
  };

  try {
    await db.insert(projectEnquiriesTable).values(enquiry);
    revalidatePath('/admin/inquiries');
    return {
      message: 'Thank you! Your enquiry has been submitted. We will get in touch soon.',
      success: true,
    };
  } catch (error) {
    logSecurityEvent({
      type: 'api_error',
      path: 'enquiry',
      action: 'submitProjectEnquiry',
      message: error instanceof Error ? error.message : 'insert_failed',
      ip,
    });
    return { message: 'An unexpected error occurred. Please try again later.', success: false };
  }
}
