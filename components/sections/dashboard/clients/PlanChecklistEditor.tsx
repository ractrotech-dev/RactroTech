'use client';

import { Label } from '@/components/ui/label';
import type { PlanChecklistGroup } from '@/utils/clients/plan-types';

type PlanChecklistEditorProps = {
  groups: PlanChecklistGroup[];
  onChange?: (groups: PlanChecklistGroup[]) => void;
  readOnly?: boolean;
};

export function PlanChecklistEditor({
  groups,
  onChange,
  readOnly = false,
}: PlanChecklistEditorProps) {
  const toggle = (groupId: string, itemId: string) => {
    if (readOnly || !onChange) return;
    onChange(
      groups.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              items: g.items.map((item) =>
                item.id === itemId
                  ? { ...item, checked: !item.checked }
                  : item,
              ),
            },
      ),
    );
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="rounded-lg border border-border bg-muted/20 p-4"
        >
          <Label className="text-sm font-semibold">{group.title}</Label>
          <ul className="mt-3 space-y-2">
            {group.items.map((item) => (
              <li key={item.id}>
                <label
                  className={`flex items-start gap-3 text-sm ${readOnly ? '' : 'cursor-pointer'}`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    disabled={readOnly}
                    onChange={() => toggle(group.id, item.id)}
                    className="mt-0.5 h-4 w-4 rounded border-input"
                  />
                  <span
                    className={
                      item.checked
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    }
                  >
                    {item.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
