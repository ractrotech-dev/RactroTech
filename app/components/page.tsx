import { ComponentsLibraryPage } from "../../components/sections/components/ComponentsLibraryPage"

export const dynamic = "force-dynamic"

export default function ComponentsPage() {
  return (
    <main className="flex min-h-screen bg-background">
      <ComponentsLibraryPage />
    </main>
  )
}

