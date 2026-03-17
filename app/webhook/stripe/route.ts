import { isStripeConfigured } from '@/utils/stripe/api';

export async function POST(req: Request) {
    if (!isStripeConfigured()) {
        return new Response('Stripe not configured', { status: 200 });
    }
    try {
        // For now, do not touch any database; just acknowledge events
        const event = await req.json();
        console.log("Stripe webhook event received:", event.type);
        return new Response('Success', { status: 200 });
    } catch (err) {
        return new Response(`Webhook error: ${err instanceof Error ? err.message : "Unknown error"}`, {
            status: 400,
        })
    }
}