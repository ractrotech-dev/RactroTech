import { Stripe } from 'stripe';
import { db } from '../db/db';
import { usersTable } from '../db/schema';
import { eq } from "drizzle-orm";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const isStripeConfigured = () => Boolean(STRIPE_SECRET_KEY?.trim());

export const stripe = isStripeConfigured()
  ? new Stripe(STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
  : null;

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

/** Placeholder stripe_id when Stripe is not configured (schema requires a value). */
export const STRIPE_DISABLED_PLACEHOLDER = 'no-stripe';

export async function getStripePlan(email: string): Promise<string> {
  if (!stripe) return 'Free';
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user.length || user[0].plan === 'none' || user[0].stripe_id === STRIPE_DISABLED_PLACEHOLDER) return 'Free';
  try {
    const subscription = await stripe.subscriptions.retrieve(user[0].plan);
    const productId = subscription.items.data[0].plan.product as string;
    const product = await stripe.products.retrieve(productId);
    return product.name;
  } catch {
    return 'Free';
  }
}

export async function createStripeCustomer(id: string, email: string, name?: string): Promise<string> {
  if (!stripe) return STRIPE_DISABLED_PLACEHOLDER;
  const customer = await stripe.customers.create({
    name: name ?? "",
    email,
    metadata: { supabase_id: id },
  });
  return customer.id;
}

export async function createStripeCheckoutSession(email: string): Promise<string | null> {
  if (!stripe) return null;
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user.length || user[0].stripe_id === STRIPE_DISABLED_PLACEHOLDER) return null;
  const customerSession = await stripe.customerSessions.create({
    customer: user[0].stripe_id,
    components: { pricing_table: { enabled: true } },
  });
  return customerSession.client_secret;
}

export async function generateStripeBillingPortalLink(email: string): Promise<string | null> {
  if (!stripe) return null;
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user.length || user[0].stripe_id === STRIPE_DISABLED_PLACEHOLDER) return null;
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user[0].stripe_id,
    return_url: `${PUBLIC_URL}/dashboard`,
  });
  return portalSession.url;
}
