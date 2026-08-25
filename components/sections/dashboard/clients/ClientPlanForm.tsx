'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CLIENT_CATEGORIES, CLIENT_STAGES } from '@/utils/clients/constants';
import {
  DEFAULT_ONBOARD_PLAN_CHECKLISTS,
  DEFAULT_ONBOARD_PLAN_STEPS,
  type OnboardPlanRecord,
  type OnboardPlanStep,
  type PlanChecklistGroup,
} from '@/utils/clients/plan-types';
import { RACTROTECH_UK_DEFAULT_PLAN } from '@/utils/clients/uk-playbook';
import { PlanChecklistEditor } from './PlanChecklistEditor';

type ClientPlanFormProps = {
  plan?: OnboardPlanRecord | null;
  submitLabel: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : label}
    </Button>
  );
}

export function ClientPlanForm({ plan, submitLabel }: ClientPlanFormProps) {
  const [steps, setSteps] = useState<OnboardPlanStep[]>(
    plan?.steps?.length ? plan.steps : DEFAULT_ONBOARD_PLAN_STEPS,
  );
  const [checklists, setChecklists] = useState<PlanChecklistGroup[]>(
    plan?.checklists?.length
      ? plan.checklists
      : DEFAULT_ONBOARD_PLAN_CHECKLISTS,
  );

  const updateStep = (
    index: number,
    field: keyof OnboardPlanStep,
    value: string,
  ) => {
    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, [field]: value } : step,
      ),
    );
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        order: prev.length + 1,
        stage: 'lead',
        title: '',
        description: '',
      },
    ]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 })),
    );
  };

  const loadUkTemplate = () => {
    setSteps(RACTROTECH_UK_DEFAULT_PLAN.steps);
    setChecklists(
      RACTROTECH_UK_DEFAULT_PLAN.checklists.map((g) => ({
        ...g,
        items: g.items.map((i) => ({ ...i })),
      })),
    );
  };

  return (
    <>
      {plan?.id && <input type="hidden" name="id" value={plan.id} />}
      <input type="hidden" name="steps_json" value={JSON.stringify(steps)} />
      <input
        type="hidden"
        name="checklists_json"
        value={JSON.stringify(checklists)}
      />

      {!plan && (
        <Button type="button" variant="outline" size="sm" onClick={loadUkTemplate}>
          Load UK full playbook template
        </Button>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="plan-title">Plan title</Label>
          <Input
            id="plan-title"
            name="title"
            required
            defaultValue={plan?.title ?? RACTROTECH_UK_DEFAULT_PLAN.title}
            placeholder="UK gyms & cafés — full pipeline"
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="plan-description">Overview</Label>
          <textarea
            id="plan-description"
            name="description"
            rows={3}
            defaultValue={
              plan?.description ?? RACTROTECH_UK_DEFAULT_PLAN.description
            }
            className="flex min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="plan-category">Primary business type</Label>
          <select
            id="plan-category"
            name="category"
            defaultValue={plan?.category ?? 'cafe'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            {CLIENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Follow-along checklists</Label>
        <p className="text-xs text-muted-foreground">
          Tick regions, business types, and outreach channels as you execute the
          plan.
        </p>
        <PlanChecklistEditor groups={checklists} onChange={setChecklists} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Pipeline steps (list → call → onboard → build → complete)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add step
          </Button>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-muted/30 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Step {index + 1}
                </span>
                {steps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Stage</Label>
                  <select
                    value={step.stage}
                    onChange={(e) =>
                      updateStep(index, 'stage', e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {CLIENT_STAGES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Step title</Label>
                  <Input
                    value={step.title}
                    onChange={(e) =>
                      updateStep(index, 'title', e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>What to do</Label>
                <textarea
                  value={step.description}
                  onChange={(e) =>
                    updateStep(index, 'description', e.target.value)
                  }
                  rows={2}
                  className="flex min-h-[56px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <SubmitButton label={submitLabel} />
    </>
  );
}
