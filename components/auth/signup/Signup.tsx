import SignupForm from "./SignupForm"
import ProviderSigninBlock from "../ProviderSigninBlock"
import Link from 'next/link'

export default function Signup() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Signup</h1>
            <SignupForm />
            <div className="my-4 border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Or continue with</p>
                <ProviderSigninBlock />
            </div>
            <div className="mt-4 text-sm">
                <Link href="/login">Already have an account? Login</Link>
            </div>
        </div>
    )
}
