import { z } from 'zod';
import { formatZodError } from './schemas';

export function parseFormData<T>(
  schema: z.ZodType<T>,
  formData: FormData,
): { ok: true; data: T } | { ok: false; message: string } {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      raw[key] = value;
    }
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    return { ok: false, message: formatZodError(result.error) };
  }
  return { ok: true, data: result.data };
}
