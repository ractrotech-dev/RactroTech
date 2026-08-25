'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { Pencil, Plus, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  createOnboardPlan,
  deleteOnboardPlan,
  ensureDefaultOnboardPlan,
  updateOnboardPlan,
} from '@/app/actions/client-plans';
import {
  clientActionInitialState,
  getCategoryLabel,
} from '@/utils/clients/constants';
import {
  checklistProgress,
  normalizePlanChecklists,
  normalizePlanSteps,
  stepsSummary,
  type OnboardPlanRecord,
} from '@/utils/clients/plan-types';
import { createClient } from '@/utils/supabase/client';
import { ClientPlanForm } from './ClientPlanForm';
import { HowToGetCustomersPanel } from './HowToGetCustomersPanel';
import { PlanChecklistEditor } from './PlanChecklistEditor';

function stageLabel(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ClientPlansTab() {
  const [plans, setPlans] = useState<OnboardPlanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editing, setEditing] = useState<OnboardPlanRecord | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const [createState, createAction] = useFormState(
    createOnboardPlan,
    clientActionInitialState,
  );
  const [updateState, updateAction] = useFormState(
    updateOnboardPlan,
    clientActionInitialState,
  );

  const mapPlans = (rows: Record<string, unknown>[]) =>
    rows.map((row) => ({
      ...row,
      steps: normalizePlanSteps(row.steps) ?? [],
      checklists: normalizePlanChecklists(row.checklists),
    })) as OnboardPlanRecord[];

  const fetchPlans = async (userId: string) => {
    const supabase = createClient();
    return supabase
      .from('client_onboard_plans')
      .select(
        'id, title, description, category, steps, checklists, created_at, updated_at',
      )
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
  };

  const loadPlans = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    let { data, error } = await fetchPlans(user.id);

    if (!error && (!data || data.length === 0)) {
      const seed = await ensureDefaultOnboardPlan();
      if (seed.success && seed.message) {
        setFeedback({ message: seed.message, success: true });
      } else if (!seed.success && seed.message) {
        setFeedback({ message: seed.message, success: false });
        setLoading(false);
        return;
      }
      const refetch = await fetchPlans(user.id);
      data = refetch.data;
      error = refetch.error;
    }

    if (!error && data) {
      setPlans(mapPlans(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    if (createState.message) {
      setFeedback({ message: createState.message, success: createState.success });
      if (createState.success) {
        setMode('list');
        loadPlans();
      }
    }
  }, [createState, loadPlans]);

  useEffect(() => {
    if (updateState.message) {
      setFeedback({ message: updateState.message, success: updateState.success });
      if (updateState.success) {
        setMode('list');
        setEditing(null);
        loadPlans();
      }
    }
  }, [updateState, loadPlans]);

  const handleDelete = (plan: OnboardPlanRecord) => {
    if (!window.confirm(`Delete plan "${plan.title}"?`)) return;
    startTransition(async () => {
      const result = await deleteOnboardPlan(plan.id);
      setFeedback({ message: result.message, success: result.success });
      if (result.success) {
        setPlans((prev) => prev.filter((p) => p.id !== plan.id));
      }
    });
  };

  if (mode === 'create') {
    return (
      <div className="space-y-6">
        <HowToGetCustomersPanel />
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">New onboard plan</CardTitle>
              <CardDescription>
                Full pipeline: customer list → call/email → onboard → build →
                complete.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMode('list')}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form action={createAction} className="space-y-6">
              <ClientPlanForm submitLabel="Create plan" />
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'edit' && editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Edit plan</CardTitle>
            <CardDescription>{editing.title}</CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setMode('list');
              setEditing(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-6">
            <ClientPlanForm plan={editing} submitLabel="Save plan" />
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <HowToGetCustomersPanel />

      {feedback && (
        <p
          className={`text-sm font-medium ${
            feedback.success ? 'text-emerald-600' : 'text-destructive'
          }`}
        >
          {feedback.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => setMode('create')}>
          <Plus className="mr-1 h-4 w-4" />
          New plan
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading plans…</p>
      ) : plans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
          Seeding your UK playbook… If this stays empty, run migration{' '}
          <code className="text-xs">0010</code> and <code className="text-xs">0012</code>{' '}
          in Supabase, then refresh.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">
                    {plan.title}
                  </CardTitle>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(plan);
                        setMode('edit');
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDelete(plan)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {plan.category && (
                  <p className="text-xs text-muted-foreground">
                    Focus: {getCategoryLabel(plan.category)}
                  </p>
                )}
                <CardDescription className="line-clamp-2">
                  {plan.description || stepsSummary(plan.steps)}
                </CardDescription>
                <p className="text-xs font-medium text-primary">
                  {checklistProgress(plan.checklists)}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <PlanChecklistEditor groups={plan.checklists} readOnly />
                <p className="text-xs text-muted-foreground italic">
                  Edit plan to tick checklists and save progress.
                </p>
                <ol className="space-y-2 border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Pipeline
                  </p>
                  {plan.steps.map((step) => (
                    <li key={step.order} className="text-sm">
                      <span className="font-medium">{step.order}. {step.title}</span>
                      <span className="ml-2 text-[10px] uppercase text-muted-foreground">
                        {stageLabel(step.stage)}
                      </span>
                      {step.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
