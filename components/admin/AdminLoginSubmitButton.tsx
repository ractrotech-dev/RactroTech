'use client'

import { useFormStatus } from 'react-dom'

import { buttonClass } from '@/components/admin/ui'

export function AdminLoginSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={buttonClass('primary', 'md', 'mt-2 h-10 w-full')}
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}
