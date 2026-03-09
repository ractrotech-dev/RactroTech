import LoginForm from "./LoginForm"
import ProviderSigninBlock from "../ProviderSigninBlock"
import Link from 'next/link'

export default function Login() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <LoginForm />
            <div className="my-4 border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Or continue with</p>
                <ProviderSigninBlock />
            </div>
            <div className="flex flex-col gap-2 mt-4 text-sm">
                <Link href="/forgot-password">Forgot password?</Link>
                <Link href="/signup">{`Don't have an account? Signup`}</Link>
            </div>
        </div>
    )
}
