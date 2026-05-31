"use client"

import { useEffect, useState } from "react"

/** Avoid hydration mismatch for client-only UI (theme toggle, etc.) */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
