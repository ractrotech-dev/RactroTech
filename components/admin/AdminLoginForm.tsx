import { loginAdminUser } from '@/app/admin/login/actions'
import { AdminLoginSubmitButton } from '@/components/admin/AdminLoginSubmitButton'
import { Notice, field } from '@/components/admin/ui'

type AdminLoginFormProps = {
  errorMessage?: string
}

export default function AdminLoginForm({ errorMessage }: AdminLoginFormProps) {
  return (
    <form action={loginAdminUser} className="space-y-4">
      {errorMessage ? <Notice tone="red">{errorMessage}</Notice> : null}

      <div>
        <label htmlFor="email" className={field.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="admin@example.com"
          required
          autoComplete="email"
          className={field.input}
        />
      </div>
      <div>
        <label htmlFor="password" className={field.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={field.input}
        />
      </div>

      <AdminLoginSubmitButton />
    </form>
  )
}
