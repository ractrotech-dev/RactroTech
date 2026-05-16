import { loginAdminUser } from '@/app/admin/login/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminLoginSubmitButton } from '@/components/admin/AdminLoginSubmitButton'

type AdminLoginFormProps = {
  errorMessage?: string
}

export default function AdminLoginForm({ errorMessage }: AdminLoginFormProps) {
  return (
    <form action={loginAdminUser} className="space-y-2">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="admin@example.com" name="email" required />
      </div>
      <div className="mt-2 grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" required autoComplete="current-password" />
      </div>

      <AdminLoginSubmitButton />

      {errorMessage ? (
        <p className="py-2 text-center text-sm font-bold text-red-600">{errorMessage}</p>
      ) : null}
    </form>
  )
}
