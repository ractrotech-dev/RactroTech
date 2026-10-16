'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';

import { startScrapeAction, type ActionState } from '@/app/admin/outreach/actions';
import { buttonClass, field } from '@/components/admin/ui';
import { MAX_SEARCHES_PER_SUBMIT } from '@/lib/outreach/constants';
import { CATEGORY_GROUPS, CITIES, REGIONS } from '@/lib/outreach/taxonomy';
import { cn } from '@/lib/utils';

import { ActionResult, SubmitButton } from './FormAction';

/** Country, cities and categories → one Apify Google Maps run per city × category. */
export function SearchForm() {
  const [state, action] = useFormState<ActionState, FormData>(startScrapeAction, {});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [country, setCountry] = useState('');
  const [cities, setCities] = useState<Set<string>>(new Set());
  const [customCity, setCustomCity] = useState('');

  const cityOptions = CITIES[country] ?? [];
  const cityCount = cities.size + customCity.split(',').filter((c) => c.trim()).length;
  const searches = Math.max(cityCount, 1) * selected.size;
  const tooMany = searches > MAX_SEARCHES_PER_SUBMIT;

  const toggleCity = (city: string) =>
    setCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
      return next;
    });

  const toggle = (labels: string[], on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      labels.forEach((l) => (on ? next.add(l) : next.delete(l)));
      return next;
    });

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="sm:col-span-3">
          <label className={field.label} htmlFor="country">
            Country
          </label>
          <select
            id="country"
            name="country"
            className={field.input}
            required
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCities(new Set());
            }}
          >
            <option value="" disabled>
              Select a country…
            </option>
            {REGIONS.map((r) => (
              <optgroup key={r.name} label={`${r.flag} ${r.name}`}>
                {r.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className={field.label} htmlFor="maxResults">
            Max results per search
          </label>
          <input id="maxResults" name="maxResults" type="number" min={1} max={500} defaultValue={50} className={field.input} />
        </div>
      </div>

      {country ? (
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[13px] font-medium text-mkt-ink">Cities (recommended)</span>
            <button type="button" className="text-[13px] font-medium text-mkt-violet hover:underline" onClick={() => setCities(new Set(cityOptions))}>
              Select all
            </button>
            <button type="button" className="text-[13px] font-medium text-mkt-muted hover:text-mkt-ink" onClick={() => setCities(new Set())}>
              Clear
            </button>
            <span className="text-[12px] text-mkt-muted">None selected = whole country (fewer, less local results)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cityOptions.map((city) => {
              const on = cities.has(city);
              return (
                <label
                  key={city}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-1 text-[13px] transition-colors',
                    on
                      ? 'border-mkt-violet bg-mkt-violet text-white'
                      : 'border-mkt-line bg-mkt-surface text-mkt-ink hover:border-mkt-violet/50'
                  )}
                >
                  <input type="checkbox" name="city" value={city} checked={on} onChange={() => toggleCity(city)} className="sr-only" />
                  {city}
                </label>
              );
            })}
          </div>
          <input
            name="customCity"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            className={cn(field.input, 'mt-3 sm:w-1/2')}
            placeholder="Other cities, comma-separated (e.g. Boulder, Santa Fe)"
          />
        </div>
      ) : null}

      <div>
        <span className={field.label}>Categories</span>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_GROUPS.map((g) => {
            const labels = g.categories.map((c) => c.label);
            const all = labels.every((l) => selected.has(l));
            return (
              <fieldset key={g.name} className="rounded-xl border border-mkt-line p-3">
                <legend className="px-1 text-[13px] font-medium text-mkt-ink">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={all} onChange={(e) => toggle(labels, e.target.checked)} className="accent-mkt-violet" />
                    {g.icon} {g.name}
                  </label>
                </legend>
                {g.categories.map((c) => (
                  <label key={c.label} className="flex items-center gap-2 py-0.5 text-[13px] text-mkt-ink/80">
                    <input
                      type="checkbox"
                      name="category"
                      value={c.label}
                      checked={selected.has(c.label)}
                      onChange={(e) => toggle([c.label], e.target.checked)}
                      className="accent-mkt-violet"
                    />
                    {c.label}
                  </label>
                ))}
              </fieldset>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-[13px] text-mkt-ink">
          <input type="checkbox" name="withWebsite" defaultChecked className="accent-mkt-violet" /> Only businesses with a website (better email hit rate)
        </label>
        <SubmitButton className={buttonClass('primary', 'md', 'ml-auto')} pendingLabel="Starting…" disabled={selected.size === 0 || tooMany}>
          {`Find leads${searches ? ` (${searches} search${searches > 1 ? 'es' : ''})` : ''}`}
        </SubmitButton>
      </div>
      {tooMany ? (
        <p className="text-[13px] text-amber-800 dark:text-amber-300">
          {searches} searches (cities × categories) — max {MAX_SEARCHES_PER_SUBMIT} at once. Pick fewer.
        </p>
      ) : null}
      <ActionResult state={state} />
    </form>
  );
}
