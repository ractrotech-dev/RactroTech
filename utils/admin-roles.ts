/**
 * Client-safe admin role utilities.
 * Safe to import in both client and server components.
 */

/** Role hierarchy — higher index = more access */
const ROLE_HIERARCHY = ['user', 'client', 'developer', 'manager', 'admin', 'super_admin'] as const;
export type AdminRole = (typeof ROLE_HIERARCHY)[number];

/** Roles that can access /admin */
export const ADMIN_ROLES: AdminRole[] = ['super_admin', 'admin', 'manager', 'developer'];

/**
 * Check if the user's role has access to a required minimum role.
 */
export function hasRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(requiredRole);
}

/**
 * Get a user-friendly role label.
 */
export function getRoleLabel(role: AdminRole): string {
  const labels: Record<AdminRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    developer: 'Developer',
    client: 'Client',
    user: 'User',
  };
  return labels[role] || role;
}

/**
 * Colour classes for a role pill: the same soft tones as `Badge` in components/admin/ui.tsx
 * (violet = admin access, blue = internal staff, neutral = everyone else). Colour only; the
 * caller supplies the pill shape.
 *
 * Keep these strings identical to the Badge tones: Tailwind does not scan utils/, so a class
 * only exists here because ui.tsx already uses it.
 */
export function getRoleBadgeClasses(role: AdminRole): string {
  const violet = 'bg-mkt-violet/10 text-mkt-violet';
  const blue = 'bg-sky-500/10 text-sky-700 dark:text-sky-300';
  const neutral = 'bg-mkt-ink/[0.06] text-mkt-ink/70';
  const colors: Record<AdminRole, string> = {
    super_admin: violet,
    admin: violet,
    manager: blue,
    developer: blue,
    client: neutral,
    user: neutral,
  };
  return colors[role] || colors.user;
}
