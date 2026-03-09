import Link from 'next/link'

export default function ResetPasswordSuccess() {
    return (
        <div className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Password Successfully Reset</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Your password has been successfully reset!
            </p>
            <Link href="/login" className="text-blue-500 hover:underline">
                Login here
            </Link>
        </div>
    )
}
