'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, ChevronDown, Moon, Save, Sun } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { HeroGlow } from '@/components/marketing/mockups/doodles';
import { buildSrcDoc, getFrameWidthClass } from './build-src-doc';
import { fetchLibraryCategories } from './fetch-library-data';
import type { Category, PreviewDevice } from './types';
import { LIBRARY_INDUSTRIES, LIBRARY_STYLES } from '@/lib/component-library/constants';
import { saveComponentAction, loadComponentForEditAction } from '@/lib/components/actions';
import { STARTER_SNIPPETS } from '@/lib/component-library/starter-snippets';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

const DEVICES: PreviewDevice[] = ['mobile', 'tablet', 'desktop'];

const fieldClass =
  'w-full rounded-xl border border-mkt-line bg-mkt-surface px-3.5 py-2.5 text-[14px] text-mkt-ink outline-none transition-colors placeholder:text-mkt-muted hover:border-mkt-ink/25 focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2';

const labelClass = 'block text-[13px] font-medium text-mkt-muted';

/** Native `<select>` restyled to match `fieldClass`, with the browser arrow replaced. */
function SelectField({
  label,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className={cn('block', className)}>
      <span className={labelClass}>{label}</span>
      <span className="relative mt-1.5 block">
        <select {...props} className={cn(fieldClass, 'cursor-pointer appearance-none pr-9')}>
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mkt-muted"
          aria-hidden
        />
      </span>
    </label>
  );
}

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
      <div className="mkt-shell py-24 text-center text-[15px] text-mkt-muted">Loading editor…</div>
    );
  }

  return (
    <div className="pb-20 lg:pb-28">
      <section className="relative overflow-hidden pb-10 pt-12 sm:pt-16">
        <HeroGlow />
        <Reveal className="mkt-shell relative">
          {/* Wrapped so the inline-flex eyebrow below starts on its own line. */}
          <div>
            <Link
              href="/components"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-mkt-muted transition-colors hover:text-mkt-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to library
            </Link>
          </div>

          <span className="mkt-eyebrow mt-6">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            Component builder
          </span>

          <h1 className="mkt-display mt-6 text-[32px] leading-[1.08] sm:text-[42px]">
            {componentId ? 'Edit your component' : 'Make your own component'}
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-mkt-muted">
            Write Tailwind HTML, preview it on different devices, then save it to the public
            library.
          </p>
        </Reveal>
      </section>

      <div className="mkt-shell space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-medium text-mkt-muted">Start from:</span>
          {STARTER_SNIPPETS.map((starter) => (
            <button
              key={starter.id}
              type="button"
              onClick={() => applyStarter(starter.id)}
              className="rounded-full border border-mkt-line bg-mkt-surface px-3.5 py-1.5 text-[13px] font-medium text-mkt-ink transition-colors hover:border-mkt-ink/25 hover:bg-mkt-lavender hover:text-mkt-violet"
            >
              {starter.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="mkt-card space-y-4 p-6">
            <h2 className="mkt-display text-[15px]">Details</h2>

            <label className="block">
              <span className={labelClass}>Title</span>
              <input
                className={cn(fieldClass, 'mt-1.5')}
                placeholder="Component title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Description</span>
              <textarea
                className={cn(fieldClass, 'mt-1.5 min-h-[80px] resize-y')}
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <SelectField
              label="Category"
              value={selectedCategoryId ?? ''}
              onChange={(e) => setSelectedCategoryId(e.target.value || null)}
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </SelectField>

            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Style"
                value={styleVariant}
                onChange={(e) => setStyleVariant(e.target.value)}
              >
                {LIBRARY_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="Industry"
                value={industryVariant}
                onChange={(e) => setIndustryVariant(e.target.value)}
              >
                {LIBRARY_INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </SelectField>

              <label className="block">
                <span className={labelClass}>Tags</span>
                <input
                  className={cn(fieldClass, 'mt-1.5')}
                  placeholder="Comma-separated"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </label>
            </div>

            <label className="flex items-center gap-2.5 text-[14px] text-mkt-ink">
              <input
                type="checkbox"
                checked={supportsDarkMode}
                onChange={(e) => setSupportsDarkMode(e.target.checked)}
                className="h-4 w-4 rounded border-mkt-line text-mkt-violet accent-mkt-violet focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2"
              />
              Supports dark mode preview
            </label>

            <label className="block">
              <span className={labelClass}>HTML + Tailwind</span>
              <textarea
                className={cn(
                  fieldClass,
                  'mt-1.5 h-64 resize-y bg-mkt-contrast p-4 font-mono text-[12.5px] leading-relaxed text-white/85 placeholder:text-white/40 hover:border-mkt-ink/25'
                )}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </label>
          </div>

          <div className="mkt-card flex flex-col overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-mkt-line px-5 py-4">
              <h2 className="mkt-display text-[15px]">Live preview</h2>
              <div className="flex flex-wrap items-center gap-2">
                {supportsDarkMode && (
                  <button
                    type="button"
                    onClick={() => setDarkPreview((v) => !v)}
                    aria-pressed={darkPreview}
                    className={cn(
                      'inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-colors',
                      darkPreview
                        ? 'border-transparent bg-mkt-violet text-white'
                        : 'border-mkt-line text-mkt-muted hover:border-mkt-ink/25 hover:text-mkt-ink'
                    )}
                  >
                    {darkPreview ? (
                      <Moon className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <Sun className="h-3.5 w-3.5" aria-hidden />
                    )}
                    Dark
                  </button>
                )}

                <div
                  className="flex items-center gap-1 rounded-full border border-mkt-line p-1"
                  role="group"
                  aria-label="Preview width"
                >
                  {DEVICES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDevice(value)}
                      aria-pressed={device === value}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-[13px] font-medium capitalize transition-colors',
                        device === value
                          ? 'bg-mkt-violet text-white'
                          : 'text-mkt-muted hover:text-mkt-ink'
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-x-auto bg-mkt-surface-2 p-4 sm:p-6">
              <div
                className={cn(
                  'h-[320px] overflow-hidden rounded-2xl border border-mkt-line bg-mkt-surface shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)]',
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
            </div>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-mkt-muted">
            Saved components appear in the public library with a{' '}
            <span className="font-medium text-mkt-ink">custom</span> tag.
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !description.trim() || !code.trim()}
            className="mkt-btn-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            <Save className="h-4 w-4" aria-hidden />
            {isSaving ? 'Saving…' : componentId ? 'Update component' : 'Save to library'}
          </button>
        </div>
      </div>
    </div>
  );
}
