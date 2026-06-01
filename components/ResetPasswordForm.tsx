"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from 'react-dom'
import { resetPassword } from '@/app/auth/actions'

export default function ResetPasswordForm() {
    const initialState = { message: '' }
    const [formState, formAction] = useFormState(resetPassword, initialState)

    return (
        <form action={formAction}>
            <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    name="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                />
                <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm password"
                    name="confirm_password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                />
            </div>
            <Button className="w-full mt-4" type="submit">Update Password</Button>
            {formState?.message && (
                <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
            )}
        </form>
    )
}
