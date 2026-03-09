import StripePricingTable from "@/components/StripePricingTable";
import { createClient } from '@/utils/supabase/server'
import { createStripeCheckoutSession, isStripeConfigured } from "@/utils/stripe/api";
import Link from "next/link";

export default async function Subscribe() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const checkoutSessionSecret = user ? await createStripeCheckoutSession(user.email!) : null
    const stripeConfigured = isStripeConfigured() && checkoutSessionSecret

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Pricing</h1>
            {stripeConfigured ? (
                <StripePricingTable checkoutSessionSecret={checkoutSessionSecret} />
            ) : (
                <div className="p-4 border rounded">
                    <p className="text-muted-foreground mb-4">Stripe is not configured. Add your Stripe keys to enable pricing and subscriptions.</p>
                    <Link href="/dashboard" className="text-blue-500 hover:underline">Go to Dashboard</Link>
                </div>
            )}
        </div>
    )
}