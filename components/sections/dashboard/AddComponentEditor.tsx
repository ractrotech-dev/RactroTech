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
import { buildSrcDoc, getFrameWidthClass } from "@/components/sections/components/build-src-doc"
import { LIBRARY_INDUSTRIES, LIBRARY_STYLES } from "@/lib/component-library/constants"
import { saveCustomComponent } from "@/lib/component-library/save-custom-component"
import { STARTER_SNIPPETS } from "@/lib/component-library/starter-snippets"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import type { PreviewDevice } from "@/components/sections/components/types"

type Category = {
  id: string
  name: string
}

const DEFAULT_SNIPPET = STARTER_SNIPPETS[0].code

export function AddComponentEditor() {
  const [componentId, setComponentId] = useState<string | null>(null)
  const [title, setTitle] = useState("Starter card")
  const [description, setDescription] = useState(
    "A minimal card layout with a title, body, and primary action."
  )
  const [code, setCode] = useState(DEFAULT_SNIPPET)
  const [device, setDevice] = useState<PreviewDevice>("desktop")
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [styleVariant, setStyleVariant] = useState<string>("minimal")
  const [industryVariant, setIndustryVariant] = useState<string>("saas")
  const [difficulty, setDifficulty] = useState<string>("beginner")
  const [tagsInput, setTagsInput] = useState("custom, ractrotech")
  const [supportsDarkMode, setSupportsDarkMode] = useState(true)

  const frameWidthClass = useMemo(() => getFrameWidthClass(device), [device])
  const srcDoc = useMemo(() => buildSrcDoc(code), [code])

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("category")
        .select("id, name")
        .order("name", { ascending: true })

      if (!error && data) {
        const mapped = data.map((row) => ({
          id: String(row.id),
          name: row.name,
        }))
        setCategories(mapped)
      }
    }

    loadCategories()
  }, [])

  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim()
    if (!trimmed) return

    try {
      setIsAddingCategory(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("category")
        .insert({ name: trimmed })
        .select("id, name")
        .maybeSingle()

      if (error) {
        console.error(error)
        alert("Failed to add category. Please try again.")
        return
      }

      if (data) {
        const created = { id: String(data.id), name: data.name }
        setCategories((prev) => [...prev, created].sort((a, b) =>
          a.name.localeCompare(b.name)
        ))
        setSelectedCategoryId(created.id)
        setNewCategoryName("")
      }
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !code.trim()) return

    try {
      setIsSaving(true)
      const supabase = createClient()
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      const result = await saveCustomComponent(supabase, {
        title,
        description,
        code,
        categoryId: selectedCategoryId,
        categoryName: categories.find((c) => c.id === selectedCategoryId)?.name,
        styleVariant,
        industryVariant,
        difficulty,
        tags,
        supportsDarkMode,
        componentId,
      })

      if (!result.ok) {
        alert(result.message)
        return
      }

      if (!componentId) {
        setComponentId(result.id)
      }

      alert(componentId ? "Component updated successfully." : "Component saved successfully.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
          Builder
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Add new component
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste your Next.js + Tailwind markup and preview how it responds on different
          device sizes. Later, you can connect this to persistence.
        </p>
      </header>

      <div className="space-y-6">
        <Card className="flex h-[100vh] flex-col">
          <CardHeader className="space-y-4">
            <div className="space-y-1">
              <CardTitle className="text-base">Metadata</CardTitle>
              <CardDescription>
                Give your component a clear title and description.
              </CardDescription>
            </div>
            <div className="space-y-3">
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Component title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <textarea
                className="min-h-[72px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Short description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
                Category
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-xs"
                  value={selectedCategoryId ?? ""}
                  onChange={(event) =>
                    setSelectedCategoryId(
                      event.target.value ? event.target.value : null
                    )
                  }
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-1 items-center gap-2">
                  <input
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="whitespace-nowrap text-xs"
                    onClick={handleAddCategory}
                    disabled={isAddingCategory || !newCategoryName.trim()}
                  >
                    {isAddingCategory ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Style variant</p>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={styleVariant}
                  onChange={(e) => setStyleVariant(e.target.value)}
                >
                  {LIBRARY_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Industry</p>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={industryVariant}
                  onChange={(e) => setIndustryVariant(e.target.value)}
                >
                  {LIBRARY_INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Difficulty</p>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Tags (comma-separated)</p>
                <input
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={supportsDarkMode}
                onChange={(e) => setSupportsDarkMode(e.target.checked)}
              />
              Supports dark mode preview
            </label>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            <p className="mb-2 text-xs font-medium tracking-[0.16em] text-muted-foreground">
              Code
            </p>
            <textarea
              className="h-[calc(100%-1.75rem)] w-full resize-none rounded-md border border-border bg-muted/40 p-3 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>

        <Card className="flex h-[100vh] flex-col">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Preview</CardTitle>
              <CardDescription>
                Switch between device sizes to test responsiveness.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 p-0.5">
                {(["mobile", "tablet", "desktop"] as PreviewDevice[]).map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-2 text-xs capitalize",
                      device === value && "bg-background shadow-sm"
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
                className="text-xs"
                onClick={() => {
                  const previewHtml = srcDoc
                  const blob = new Blob([previewHtml], { type: "text/html" })
                  const url = URL.createObjectURL(blob)
                  window.open(url, "_blank", "noopener,noreferrer")
                }}
              >
                View full screen
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            <div className="flex h-full justify-center overflow-x-auto rounded-lg border border-border bg-muted/40 p-4">
              <div className={cn("h-full max-h-full overflow-hidden rounded-[1.25rem] bg-black", frameWidthClass)}>
                <iframe
                  title="Component preview"
                  srcDoc={srcDoc}
                  className="h-full w-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleSave}
          disabled={isSaving || !title.trim() || !description.trim() || !code.trim()}
        >
          {isSaving ? "Saving..." : "Save component"}
        </Button>
      </div>
    </div>
  )
}

