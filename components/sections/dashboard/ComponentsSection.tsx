'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"

type ComponentsSectionProps = {
  userEmail: string
}

type LibraryComponent = {
  id: string
  title: string
  description: string
}

export function ComponentsSection({ userEmail }: ComponentsSectionProps) {
  const [components, setComponents] = useState<LibraryComponent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the component "${title}"? This action cannot be undone.`
    )
    if (!confirmed) return

    const supabase = createClient()
    const { error } = await supabase.from("components").delete().eq("id", id)
    if (error) {
      console.error(error)
      alert("Failed to delete component. Please try again.")
      return
    }

    setComponents((prev) => prev.filter((component) => component.id !== id))
  }

  useEffect(() => {
    const loadComponents = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("components")
        .select("id, title, description")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setComponents(
          data.map((row) => ({
            id: String(row.id),
            title: row.title,
            description: row.description,
          }))
        )
      }

      setIsLoading(false)
    }

    loadComponents()
  }, [])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Components
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Your component library
          </h1>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium">{userEmail}</span>.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/components/new">
            Add new component
          </Link>
        </Button>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading components...</p>
      ) : components.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No components saved yet. Click &quot;Add new component&quot; to create your first one.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {components.map((component) => (
            <Card key={component.id} className="flex flex-col justify-between">
              <div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    {component.title}
                  </CardTitle>
                  <CardDescription>
                    {component.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-muted-foreground">
                  Saved component from your library.
                </CardContent>
              </div>
              <div className="flex items-center justify-end gap-2 px-4 pb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(component.id, component.title)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

