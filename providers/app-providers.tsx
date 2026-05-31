"use client"

import { ThemeProvider } from "@/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

type AppProvidersProps = {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={300}>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </TooltipProvider>
    </ThemeProvider>
  )
}
