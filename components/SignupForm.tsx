"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from "react-dom"
import { signup } from "@/app/auth/actions"

function SignupSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button className="w-full mt-4" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? "Creating account..." : "Sign up"}
    </Button>
  )
}

export default function SignupForm() {
  const initialState = {
    message: "",
  }

  const [formState, formAction] = useFormState(signup, initialState)

  return (
    <form action={formAction} className="space-y-2">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" placeholder="John Doe" name="name" required />
      </div>
      <div className="grid gap-2 mt-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" name="email" required />
      </div>
      <div className="grid gap-2 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" required />
      </div>

      <SignupSubmitButton />

      {formState?.message && (
        <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
      )}
    </form>
  )
}