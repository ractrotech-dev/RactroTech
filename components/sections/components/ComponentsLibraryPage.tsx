'use client'

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"

type Device = "mobile" | "tablet" | "desktop"

type LibraryComponent = {
  id: string
  title: string
  description: string
  code: string
  created_at: string
  category_id: string | null
}

type Category = {
  id: string
  name: string
}

export function ComponentsLibraryPage() {
  const [components, setComponents] = useState<LibraryComponent[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [device, setDevice] = useState<Device>("desktop")
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const loadComponents = async () => {
      const supabase = createClient()
      const [componentsResult, categoriesResult] = await Promise.all([
        supabase
          .from("components")
          .select("id, title, description, code, created_at, category_id")
          .order("created_at", { ascending: false }),
        supabase
          .from("category")
          .select("id, name")
          .order("name", { ascending: true }),
      ])

      if (!componentsResult.error && componentsResult.data) {
        const mapped = componentsResult.data.map((row) => ({
          id: String(row.id),
          title: row.title,
          description: row.description,
          code: row.code,
          created_at: row.created_at,
          category_id: row.category_id ?? null,
        }))
        setComponents(mapped)
        if (mapped.length > 0) {
          setActiveId(mapped[0].id)
        }
      }

      if (!categoriesResult.error && categoriesResult.data) {
        const mappedCategories = categoriesResult.data.map((row) => ({
          id: String(row.id),
          name: row.name,
        }))
        setCategories(mappedCategories)
      }

      setIsLoading(false)
    }

    loadComponents()
  }, [])

  useEffect(() => {
    // Prevent body scroll when the mobile sidebar drawer is open.
    if (!mobileSidebarOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileSidebarOpen])

  const activeComponent = components.find((c) => c.id === activeId) ?? null

  const frameWidthClass = useMemo(() => {
    // Prevent horizontal page overflow by constraining the preview frame to viewport width.
    if (device === "mobile") return "w-[375px] max-w-full"
    if (device === "tablet") return "w-[768px] max-w-full"
    return "w-full"
  }, [device])

  const srcDoc = useMemo(() => {
    if (!activeComponent) return ""

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
    </style>
  </head>
  <body>
    ${activeComponent.code}
  </body>
</html>`
  }, [activeComponent])

  return (
    <section className="relative flex w-full border-b-4 border-black bg-yellow-400 overflow-x-hidden">
      {/* subtle pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto flex w-full min-w-0 border-x-4 border-black bg-yellow-400">
        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "min-w-0 w-64 flex-col min-h-0 border-r-4 border-black bg-yellow-300",
            mobileSidebarOpen ? "fixed inset-y-0 left-0 z-50 md:static md:z-auto" : "hidden",
            "md:flex"
          )}
        >
          <div className="border-b-4 border-black px-4 py-4">
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-black">
              Components
            </h1>

            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/70">
              Browse by category
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3">
          {isLoading ? (
            <p className="px-2 text-[11px] font-medium text-black/70">
              Loading components...
            </p>
          ) : components.length === 0 ? (
            <p className="px-2 text-[11px] font-medium text-black/70">
              No components saved yet. Add one from the dashboard.
            </p>
          ) : (
            <nav className="flex flex-col gap-4 text-sm">
              {categories.map((category) => {
                const categoryComponents = components.filter(
                  (component) => component.category_id === category.id
                )
                if (categoryComponents.length === 0) return null

                return (
                  <div key={category.id} className="space-y-1">
                    <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/70">
                      {category.name}
                    </p>
                    <div className="flex flex-col gap-1">
                      {categoryComponents.map((component) => {
                        const isActive = component.id === activeId
                        return (
                          <button
                            key={component.id}
                            type="button"
                            onClick={() => {
                              setActiveId(component.id)
                              setMobileSidebarOpen(false)
                            }}
                            className={cn(
                              "flex flex-col rounded border-2 border-transparent px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                              isActive
                                ? "border-black bg-black text-yellow-400"
                                : "border-transparent bg-yellow-200/60 text-black hover:border-black/80 hover:bg-yellow-200"
                            )}
                          >
                            <span className="truncate">
                              {component.title}
                            </span>
                            <span className="mt-0.5 line-clamp-2 text-[10px] normal-case tracking-normal text-black/70">
                              {component.description}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Uncategorized components */}
              {components.some((component) => !component.category_id) && (
                <div className="space-y-1">
                  <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/70">
                    Uncategorized
                  </p>
                  <div className="flex flex-col gap-1">
                    {components
                      .filter((component) => !component.category_id)
                      .map((component) => {
                        const isActive = component.id === activeId
                        return (
                          <button
                            key={component.id}
                            type="button"
                            onClick={() => {
                              setActiveId(component.id)
                              setMobileSidebarOpen(false)
                            }}
                            className={cn(
                              "flex flex-col rounded border-2 border-transparent px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                              isActive
                                ? "border-black bg-black text-yellow-400"
                                : "border-transparent bg-yellow-200/60 text-black hover:border-black/80 hover:bg-yellow-200"
                            )}
                          >
                            <span className="truncate">
                              {component.title}
                            </span>
                            <span className="mt-0.5 line-clamp-2 text-[10px] normal-case tracking-normal text-black/70">
                              {component.description}
                            </span>
                          </button>
                        )
                      })}
                  </div>
                </div>
              )}
            </nav>
          )}
        </div>
      </aside>

        {/* Main content */}
        <section className="min-w-0 flex-1 bg-yellow-100/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
            {/* Mobile hamburger */}
            <div className="md:hidden -mt-1 mb-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex items-center gap-3 border-4 border-black bg-white px-3 py-2"
                aria-label="Open component sidebar"
              >
                <span className="sr-only">Open sidebar</span>
                <span className="flex flex-col gap-1">
                  <span className="block h-0.5 w-5 bg-black" />
                  <span className="block h-0.5 w-5 bg-black" />
                  <span className="block h-0.5 w-5 bg-black" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.16em]">
                  Components
                </span>
              </button>
            </div>

            {!activeComponent ? (
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/80">
                Select a component from the left to see its details, code, and preview.
              </p>
            ) : (
              <>
              <header className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/70">
                  Component
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  {activeComponent.title}
                </h2>
                <p className="text-sm font-semibold text-black/80">
                  {activeComponent.description}
                </p>
              </header>

              <div className="flex flex-col gap-6">
                {/* Code */}
                <Card className="flex flex-col border-4 border-black bg-yellow-50">
                  <CardHeader className="flex flex-row items-center justify-between gap-3 border-b-4 border-black pb-3">
                    <div>
                      <CardTitle className="text-sm font-black uppercase tracking-[0.24em] text-black">
                        Code
                      </CardTitle>
                      <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/70">
                        Saved Tailwind markup
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-2 border-black bg-black text-[11px] font-black uppercase tracking-[0.16em] text-yellow-400 hover:bg-black/90"
                      onClick={() => {
                        if (!activeComponent.code) return
                        navigator.clipboard
                          .writeText(activeComponent.code)
                          .catch(() => {})
                      }}
                    >
                      Copy
                    </Button>
                  </CardHeader>
                  <CardContent className="max-h-[420px] overflow-auto bg-yellow-100 p-4">
                    <pre className="whitespace-pre text-xs leading-relaxed text-black">
                      <code>{activeComponent.code}</code>
                    </pre>
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card className="flex flex-col border-4 border-black bg-yellow-50">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-4 border-black pb-3">
                    <div>
                      <CardTitle className="text-sm font-black uppercase tracking-[0.24em] text-black">
                        Preview
                      </CardTitle>
                      <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/70">
                        Check responsiveness
                      </CardDescription>
                    </div>
                    <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 justify-start sm:justify-end min-w-0">
                      <div className="flex flex-wrap items-center gap-1 rounded-md border-2 border-black bg-yellow-100 p-0.5 max-w-full">
                        {(["mobile", "tablet", "desktop"] as Device[]).map((value) => (
                          <Button
                            key={value}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-7 px-1 sm:px-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em]",
                              device === value
                                ? "bg-black text-yellow-400"
                                : "bg-transparent text-black hover:bg-black hover:text-yellow-400"
                            )}
                            onClick={() => setDevice(value)}
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-2 border-black bg-yellow-100 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em] text-black hover:bg-black hover:text-yellow-400"
                        disabled={!srcDoc}
                        onClick={() => {
                          if (!srcDoc) return
                          const blob = new Blob([srcDoc], { type: "text/html" })
                          const url = URL.createObjectURL(blob)
                          window.open(url, "_blank", "noopener,noreferrer")
                        }}
                      >
                        Full screen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pt-0">
                    <div className="flex h-[360px] justify-center overflow-x-auto bg-yellow-100 p-4 min-w-0">
                      {srcDoc ? (
                        <div
                          className={cn(
                            "h-full max-h-full overflow-hidden max-w-full rounded-[1.25rem] border-4 border-black bg-black",
                            frameWidthClass
                          )}
                        >
                          <iframe
                            title="Component preview"
                            srcDoc={srcDoc}
                            className="h-full w-full border-0"
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </div>
                      ) : (
                        <p className="text-xs font-semibold text-black/80">
                          No preview available for this component.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
          </div>
        </section>
      </div>
    </section>
  )
}
