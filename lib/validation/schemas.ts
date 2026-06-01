import { z } from 'zod';
import { LIBRARY_INDUSTRIES, LIBRARY_STYLES } from '@/lib/component-library/constants';
import { REVIEW_PROJECT_TYPE_SET } from '@/lib/reviews/constants';

const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Phone number is too short')
  .max(20, 'Phone number is too long')
  .regex(/^[+]?[\d\s().-]+$/, 'Invalid phone number format');

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .max(254)
  .transform((v) => v.toLowerCase());

export const uuidSchema = z.string().uuid('Invalid id');

export const projectEnquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .max(254)
    .optional()
    .transform((v) => (v ? v.toLowerCase() : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, 'Invalid email'),
  projectType: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(5000),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128),
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  address: z.string().trim().min(3).max(300),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const reviewSubmitSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(1).max(160),
  projectType: z.string().refine((v) => REVIEW_PROJECT_TYPE_SET.has(v), 'Invalid project type'),
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().trim().min(20).max(4000),
  permission: z.coerce.boolean(),
});

export const componentInputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(2000),
  code: z.string().trim().min(1).max(120_000),
  categoryId: z.string().uuid().nullable().optional(),
  categoryName: z.string().max(120).optional(),
  styleVariant: z.string().refine((v) => (LIBRARY_STYLES as readonly string[]).includes(v)),
  industryVariant: z.string().refine((v) => (LIBRARY_INDUSTRIES as readonly string[]).includes(v)),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  supportsDarkMode: z.boolean(),
  componentId: z.string().uuid().nullable().optional(),
});

export const adminSearchSchema = z.object({
  query: z.string().trim().min(2).max(100),
});

export function formatZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid input';
}
