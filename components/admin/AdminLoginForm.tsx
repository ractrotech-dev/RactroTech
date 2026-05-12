'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAdminUser } from '@/app/admin/login/actions'

function LoginSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="mt-4 w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Logging in...' : 'Log in to Admin'}
    </Button>
  )
}

export default function AdminLoginForm() {
  const initialState = { message: '' }
  const [formState, formAction] = useFormState(loginAdminUser, initialState)

  return (
    <form action={formAction} className="space-y-2">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="admin@example.com" name="email" required />
      </div>
      <div className="mt-2 grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" required />
      </div>

      <LoginSubmitButton />

      {formState?.message ? (
        <p className="py-2 text-center text-sm font-bold text-red-600">{formState.message}</p>
      ) : null}
    </form>
  )
}

