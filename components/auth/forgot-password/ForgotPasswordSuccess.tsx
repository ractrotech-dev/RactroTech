import Link from 'next/link'

export default function ForgotPasswordSuccess() {
    return (
        <div className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Your password reset request has been processed. Check your email for a password reset request
            </p>
            <Link href="/login" className="text-blue-500 hover:underline">
                Go back to Login
            </Link>
        </div>
    )
}
