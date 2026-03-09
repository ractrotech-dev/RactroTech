import ForgotPasswordForm from "./ForgotPasswordForm"
import Link from 'next/link'

export default function ForgotPassword() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">Forgot Your Password?</h1>
            <p className="text-sm text-muted-foreground mb-4">Enter your email address</p>
            <ForgotPasswordForm />
            <div className="flex flex-col gap-2 mt-4 text-sm">
                <Link href="/login">Back to login</Link>
                <Link href="/signup">{`Don't have an account? Signup`}</Link>
            </div>
        </div>
    )
}
