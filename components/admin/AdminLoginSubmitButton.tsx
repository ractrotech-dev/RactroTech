'use client'

import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'

export function AdminLoginSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="mt-4 w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Logging in...' : 'Log in to Admin'}
    </Button>
  )
}
