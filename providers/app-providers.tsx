"use client"

import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProviderBoundary } from "@/providers/auth-provider-boundary"
import { AuthModalProvider } from "@/contexts/auth-modal-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

type AppProvidersProps = {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProviderBoundary>
        <AuthModalProvider>
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster richColors closeButton position="top-right" />
          </TooltipProvider>
        </AuthModalProvider>
      </AuthProviderBoundary>
    </ThemeProvider>
  )
}
