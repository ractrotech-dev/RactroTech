import { AddComponentEditor } from "../../../../components/sections/dashboard/AddComponentEditor"

export const dynamic = "force-dynamic"

export default function NewComponentPage() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <AddComponentEditor />
      </div>
    </main>
  )
}

