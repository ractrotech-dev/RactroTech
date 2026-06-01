
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ResetPasswordForm from '@/components/ResetPasswordForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ResetPassword() {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/forgot-password?error=expired_link')
    }

    return (
        <div className="flex items-center justify-center bg-muted min-h-screen" >
            <Card className="w-[350px] mx-auto">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center py-4">
                        <Image src="/logo.png" alt="logo" width={50} height={50} />
                    </div>

                    <CardTitle className="text-2xl font-bold">Enter your new Password</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <ResetPasswordForm />
                </CardContent>
                <CardFooter className="flex-col text-center">
                    <Link className="w-full text-sm text-muted-foreground" href="/login">
                        Back to login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
