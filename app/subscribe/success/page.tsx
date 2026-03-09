import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function SubscribeSuccess() {
    return (
        <div className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Success</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Thank you for subscribing!
            </p>
            <Link href="/dashboard">
                <Button className="w-full">
                    Go To Dashboard
                </Button>
            </Link>
        </div>
    )
}