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
 * Get role badge color classes for the retro theme.
 */
export function getRoleBadgeClasses(role: AdminRole): string {
  const colors: Record<AdminRole, string> = {
    super_admin: 'border-purple-500 bg-purple-500 text-white',
    admin: 'border-black bg-black text-white',
    manager: 'border-blue-500 bg-blue-500 text-white',
    developer: 'border-emerald-500 bg-emerald-500 text-white',
    client: 'border-yellow-400 bg-yellow-400 text-black',
    user: 'border-black/30 bg-gray-100 text-black/60',
  };
  return colors[role] || colors.user;
}
