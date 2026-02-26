import { db } from '@/utils/db/db'
import { usersTable } from '@/utils/db/schema'
import { eq } from "drizzle-orm";
import { isStripeConfigured } from '@/utils/stripe/api';

export async function POST(req: Request) {
    if (!isStripeConfigured()) {
        return new Response('Stripe not configured', { status: 200 });
    }
    try {
        const event = await req.json()

        // NOTE: handle other event types as you need
        switch (event.type) {
            case 'customer.subscription.created':
                console.log("Subscription created")
                console.log("event:", event)
                await db.update(usersTable).set({ plan: event.data.object.id }).where(eq(usersTable.stripe_id, event.data.object.customer));
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return new Response('Success', { status: 200 })
    } catch (err) {
        return new Response(`Webhook error: ${err instanceof Error ? err.message : "Unknown error"}`, {
            status: 400,
        })
    }
}