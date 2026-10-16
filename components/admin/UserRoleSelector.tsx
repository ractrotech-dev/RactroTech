'use client';

import { useEffect, useState, useTransition } from 'react';
import { ChevronDown } from 'lucide-react';

import { updateUserRole } from '@/app/admin/actions';
import type { AdminRole } from '@/utils/admin-roles';
import { getRoleBadgeClasses, getRoleLabel } from '@/utils/admin-roles';
import { cn } from '@/lib/utils';

interface UserRoleSelectorProps {
  userId: string;
  currentRole: AdminRole;
  isSuperAdmin: boolean;
}

const roles: AdminRole[] = ['super_admin', 'admin', 'manager', 'developer', 'client', 'user'];

/** Same shape as `Badge` in ui.tsx; the tone comes from getRoleBadgeClasses. */
const PILL = 'inline-flex items-center whitespace-nowrap rounded-full text-[12px] font-medium leading-5';

/**
 * A user's role as a pill. Super admins get a native select inside the pill (it is not clipped
 * by a table's scroll container the way a custom popover is); everyone else sees the label.
 */
export default function UserRoleSelector({ userId, currentRole, isSuperAdmin }: UserRoleSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<AdminRole>(currentRole);

  // Follow the server's value once the page re-renders after a change.
  useEffect(() => {
    setSelected(currentRole);
  }, [currentRole]);

  const handleRoleChange = (role: AdminRole) => {
    if (!isSuperAdmin || role === currentRole) return;
    setSelected(role);
    startTransition(async () => {
      try {
        await updateUserRole(userId, role);
      } catch (error) {
        setSelected(currentRole);
        alert(error instanceof Error ? error.message : 'Failed to update role');
      }
    });
  };

  if (!isSuperAdmin) {
    return <span className={cn(PILL, 'px-2.5 py-0.5', getRoleBadgeClasses(currentRole))}>{getRoleLabel(currentRole)}</span>;
  }

  return (
    <span
      className={cn(
        PILL,
        'relative ring-1 ring-inset ring-transparent transition-shadow hover:ring-mkt-line focus-within:ring-2 focus-within:ring-mkt-violet',
        isPending && 'opacity-60',
        getRoleBadgeClasses(selected)
      )}
    >
      <select
        value={selected}
        onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
        disabled={isPending}
        aria-label="Change role"
        className="cursor-pointer appearance-none rounded-full bg-transparent py-0.5 pl-2.5 pr-7 text-inherit focus:outline-none disabled:cursor-wait [&_option]:bg-mkt-surface [&_option]:text-mkt-ink"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {getRoleLabel(role)}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-70" />
    </span>
  );
}
