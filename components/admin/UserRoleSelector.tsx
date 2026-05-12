'use client';

import { useState, useTransition } from 'react';
import { updateUserRole } from '@/app/admin/actions';
import { Shield, ChevronDown } from 'lucide-react';
import type { AdminRole } from '@/utils/admin-roles';
import { getRoleLabel } from '@/utils/admin-roles';

interface UserRoleSelectorProps {
  userId: string;
  currentRole: AdminRole;
  isSuperAdmin: boolean;
}

const roles: AdminRole[] = ['super_admin', 'admin', 'manager', 'developer', 'client', 'user'];

export default function UserRoleSelector({ userId, currentRole, isSuperAdmin }: UserRoleSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleChange = (role: AdminRole) => {
    if (!isSuperAdmin) return;
    startTransition(async () => {
      try {
        await updateUserRole(userId, role);
        setIsOpen(false);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to update role');
      }
    });
  };

  if (!isSuperAdmin) {
    return (
      <span className="border-2 border-black/30 bg-gray-100 px-2 py-0.5 text-[9px] font-black uppercase text-black/60">
        {getRoleLabel(currentRole)}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-1.5 border-2 border-black px-2 py-0.5 text-[9px] font-black uppercase transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
          currentRole === 'super_admin' || currentRole === 'admin' ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      >
        {(currentRole === 'super_admin' || currentRole === 'admin') && <Shield size={10} />}
        {getRoleLabel(currentRole)}
        <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 min-w-[120px] border-4 border-black bg-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                disabled={role === currentRole || isPending}
                className={`flex w-full items-center px-2 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors hover:bg-yellow-400 disabled:opacity-50 ${
                  role === currentRole ? 'bg-gray-100 text-black/40' : 'text-black'
                }`}
              >
                {getRoleLabel(role)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
