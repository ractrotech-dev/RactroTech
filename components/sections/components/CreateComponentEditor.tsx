'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { buildSrcDoc, getFrameWidthClass } from './build-src-doc';
import { fetchLibraryCategories } from './fetch-library-data';
import type { Category, PreviewDevice } from './types';
import { LIBRARY_INDUSTRIES, LIBRARY_STYLES } from '@/lib/component-library/constants';
import { saveComponentAction, loadComponentForEditAction } from '@/lib/components/actions';
import { STARTER_SNIPPETS } from '@/lib/component-library/starter-snippets';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

const selectClass =
  'w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-black';

export function CreateComponentEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [componentId, setComponentId] = useState<string | null>(editId);
  const [title, setTitle] = useState(STARTER_SNIPPETS[0].title);
  const [description, setDescription] = useState(STARTER_SNIPPETS[0].description);
  const [code, setCode] = useState(STARTER_SNIPPETS[0].code);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [styleVariant, setStyleVariant] = useState('minimal');
  const [industryVariant, setIndustryVariant] = useState('saas');
  const [difficulty, setDifficulty] = useState('beginner');
  const [tagsInput, setTagsInput] = useState('custom, ractrotech');
  const [supportsDarkMode, setSupportsDarkMode] = useState(true);
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [darkPreview, setDarkPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const [error, setError] = useState<string | null>(null);

  const frameWidthClass = useMemo(() => getFrameWidthClass(device), [device]);
  const srcDoc = useMemo(() => buildSrcDoc(code, { darkMode: darkPreview }), [code, darkPreview]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { categories: loadedCategories } = await fetchLibraryCategories(supabase);
      setCategories(loadedCategories);

      if (!editId) {
        setIsLoading(false);
        return;
      }

      const editResult = await loadComponentForEditAction(editId);
      if (!editResult.ok) {
        setError(editResult.message);
        setIsLoading(false);
        return;
      }

      const data = editResult.component;
      setComponentId(data.id);
      setTitle(data.title);
      setDescription(data.description);
      setCode(data.code);
      setSelectedCategoryId(data.category_id);
      setStyleVariant(data.style_variant ?? 'minimal');
      setIndustryVariant(data.industry_variant ?? 'saas');
      setDifficulty(data.difficulty ?? 'beginner');
      setTagsInput((data.tags ?? ['custom']).join(', '));
      setSupportsDarkMode(data.supports_dark_mode ?? true);
      setIsLoading(false);
    };

    load();
  }, [editId]);

  const applyStarter = (starterId: string) => {
    const starter = STARTER_SNIPPETS.find((item) => item.id === starterId);
    if (!starter) return;
    setTitle(starter.title);
    setDescription(starter.description);
    setCode(starter.code);
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const result = await saveComponentAction({
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
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.push(`/components/${result.id}`);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-12 text-center text-sm font-medium text-black/60">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="relative border-b-4 border-black bg-yellow-100/60">
      <div className="border-b-4 border-black bg-yellow-400 px-6 py-8">
        <Link
          href="/components"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to library
        </Link>
        <h1 className="retro-heading text-3xl font-bold md:text-4xl">
          {componentId ? 'Edit your component' : 'Make your own component'}
        </h1>
        <p className="mt-2 max-w-2xl text-base font-medium text-black/75">
          Write Tailwind HTML, preview it on different devices, then save it to the public library.
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-black/70">Start from:</span>
          {STARTER_SNIPPETS.map((starter) => (
            <button
              key={starter.id}
              type="button"
              onClick={() => applyStarter(starter.id)}
              className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-yellow-200"
            >
              {starter.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="retro-card space-y-4 border-4 bg-white p-5">
            <h2 className="text-sm font-bold text-black">Details</h2>
            <input
              className={selectClass}
              placeholder="Component title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className={cn(selectClass, 'min-h-[80px] resize-y')}
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className={selectClass}
              value={selectedCategoryId ?? ''}
              onChange={(e) => setSelectedCategoryId(e.target.value || null)}
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="grid gap-3 sm:grid-cols-2">
              <select className={selectClass} value={styleVariant} onChange={(e) => setStyleVariant(e.target.value)}>
                {LIBRARY_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
              <select
                className={selectClass}
                value={industryVariant}
                onChange={(e) => setIndustryVariant(e.target.value)}
              >
                {LIBRARY_INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <select className={selectClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <input
                className={selectClass}
                placeholder="Tags (comma-separated)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-black/80">
              <input
                type="checkbox"
                checked={supportsDarkMode}
                onChange={(e) => setSupportsDarkMode(e.target.checked)}
                className="h-4 w-4 rounded border-2 border-black"
              />
              Supports dark mode preview
            </label>
            <div>
              <p className="mb-2 text-xs font-bold tracking-wide text-black/60">HTML + Tailwind</p>
              <textarea
                className="h-64 w-full resize-y rounded-md border-2 border-black bg-yellow-50 p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-black"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>

          <div className="retro-card flex flex-col border-4 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-black">Live preview</h2>
              <div className="flex flex-wrap items-center gap-2">
                {supportsDarkMode && (
                  <button
                    type="button"
                    onClick={() => setDarkPreview((v) => !v)}
                    className={cn(
                      'rounded-md border-2 border-black px-2 py-1 text-xs font-semibold',
                      darkPreview ? 'bg-black text-yellow-400' : 'bg-white text-black'
                    )}
                  >
                    {darkPreview ? 'Dark on' : 'Dark off'}
                  </button>
                )}
                {(['mobile', 'tablet', 'desktop'] as PreviewDevice[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDevice(value)}
                    className={cn(
                      'rounded-md border-2 border-black px-2 py-1 text-xs font-semibold capitalize',
                      device === value ? 'bg-black text-yellow-400' : 'bg-white text-black'
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex min-h-[360px] flex-1 items-center justify-center overflow-x-auto rounded-md border-2 border-black bg-yellow-50 p-4">
              <div className={cn('h-[320px] overflow-hidden rounded-xl border-4 border-black bg-black', frameWidthClass)}>
                <iframe
                  title="Component preview"
                  srcDoc={srcDoc}
                  className="h-full w-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-md border-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-black/60">
            Saved components appear in the public library with a <strong>custom</strong> tag.
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !description.trim() || !code.trim()}
            className="retro-button inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-5 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isSaving ? 'Saving...' : componentId ? 'Update component' : 'Save to library'}
          </button>
        </div>
      </div>
    </div>
  );
}
