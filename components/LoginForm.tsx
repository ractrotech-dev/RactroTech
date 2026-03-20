"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from "react-dom"
import { loginUser } from "@/app/auth/actions"

function LoginSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      className="w-full mt-3 border-2 border-black bg-black py-4 text-sm font-black uppercase tracking-wide text-yellow-400 hover:bg-black/95"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? "Signing in..." : "Submit Login"}
    </Button>
  )
}

export default function LoginForm() {
  const initialState = {
    message: "",
  }
  const [formState, formAction] = useFormState(loginUser, initialState)

  return (
    <form action={formAction} className="space-y-2.5">
      <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
        <Label htmlFor="email" className="mb-1 block text-[9px] font-black uppercase tracking-wide text-black/40">
          01. Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="EMAIL@COMPANY.COM"
          name="email"
          required
          className="h-auto w-full border-0 border-b-2 border-black/10 bg-transparent px-0 py-0.5 text-base font-bold uppercase tracking-tight text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
        <Label htmlFor="password" className="mb-1 block text-[9px] font-black uppercase tracking-wide text-black/40">
          02. Password
        </Label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          className="h-auto w-full border-0 border-b-2 border-black/10 bg-transparent px-0 py-0.5 text-base font-bold uppercase tracking-tight text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <LoginSubmitButton />

      {formState?.message && (
        <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
      )}
    </form>
  )
}
