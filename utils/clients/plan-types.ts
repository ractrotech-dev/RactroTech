import { CLIENT_STAGES, type ClientStage } from '@/utils/clients/constants';
import {
  DEFAULT_PLAN_CHECKLISTS,
  RACTROTECH_UK_PIPELINE_STEPS,
  type OnboardPlanStep,
  type PlanChecklistGroup,
  type PlanChecklistItem,
} from '@/utils/clients/uk-playbook';

export type { OnboardPlanStep, PlanChecklistGroup, PlanChecklistItem };

export type OnboardPlanRecord = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  steps: OnboardPlanStep[];
  checklists: PlanChecklistGroup[];
  created_at: string;
  updated_at: string | null;
};

export const DEFAULT_ONBOARD_PLAN_STEPS = RACTROTECH_UK_PIPELINE_STEPS;

export function cloneChecklistGroups(
  groups: PlanChecklistGroup[],
): PlanChecklistGroup[] {
  return groups.map((g) => ({
    ...g,
    items: g.items.map((i) => ({ ...i })),
  }));
}

export const DEFAULT_ONBOARD_PLAN_CHECKLISTS =
  cloneChecklistGroups(DEFAULT_PLAN_CHECKLISTS);

export function normalizePlanSteps(raw: unknown): OnboardPlanStep[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const steps: OnboardPlanStep[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i] as Record<string, unknown>;
    const stageRaw = String(item.stage ?? 'lead');
    const stage = CLIENT_STAGES.some((s) => s.value === stageRaw)
      ? (stageRaw as ClientStage)
      : 'lead';
    const title = String(item.title ?? '').trim();
    const description = String(item.description ?? '').trim();
    if (!title) return null;
    steps.push({
      order: i + 1,
      stage,
      title,
      description,
    });
  }
  return steps;
}

export function normalizePlanChecklists(raw: unknown): PlanChecklistGroup[] {
  if (!Array.isArray(raw)) return cloneChecklistGroups(DEFAULT_PLAN_CHECKLISTS);

  const groups: PlanChecklistGroup[] = [];
  for (const g of raw) {
    const group = g as Record<string, unknown>;
    const id = String(group.id ?? '').trim();
    const title = String(group.title ?? '').trim();
    const itemsRaw = group.items;
    if (!id || !title || !Array.isArray(itemsRaw)) continue;

    const items: PlanChecklistItem[] = [];
    for (const it of itemsRaw) {
      const row = it as Record<string, unknown>;
      const itemId = String(row.id ?? '').trim();
      const label = String(row.label ?? '').trim();
      if (!itemId || !label) continue;
      items.push({
        id: itemId,
        label,
        checked: Boolean(row.checked),
      });
    }
    if (items.length > 0) {
      groups.push({ id, title, items });
    }
  }

  return groups.length > 0
    ? groups
    : cloneChecklistGroups(DEFAULT_PLAN_CHECKLISTS);
}

export function parseStepsFromFormValue(
  value: string,
): OnboardPlanStep[] | { error: string } {
  try {
    const parsed = JSON.parse(value) as unknown;
    const steps = normalizePlanSteps(parsed);
    if (!steps) {
      return { error: 'Add at least one step with a title.' };
    }
    return steps;
  } catch {
    return { error: 'Invalid plan steps.' };
  }
}

export function parseChecklistsFromFormValue(value: string): PlanChecklistGroup[] {
  try {
    return normalizePlanChecklists(JSON.parse(value) as unknown);
  } catch {
    return cloneChecklistGroups(DEFAULT_PLAN_CHECKLISTS);
  }
}

export function stepsSummary(steps: OnboardPlanStep[]): string {
  const stages = [...new Set(steps.map((s) => s.stage))];
  return `${steps.length} steps · ${stages.join(' → ')}`;
}

export function checklistProgress(groups: PlanChecklistGroup[]): string {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const done = groups.reduce(
    (n, g) => n + g.items.filter((i) => i.checked).length,
    0,
  );
  return `${done}/${total} checklist items done`;
}
