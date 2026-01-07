import { Membership } from '@/types/user.type';

/**
 * Utility function to extract and deduplicate user roles from memberships
 *
 * @param user - User object or any object containing memberships array
 * @returns Array of unique role strings extracted from all memberships
 *
 * @example
 * ```typescript
 * const userRoles = getUserRoles(user);
 * // Returns: ["admin", "user", "moderator"]
 * ```
 */
export const getUserRoles = (user: { memberships: Membership[] } | null): string[] => {
  if (!user?.memberships?.length) {
    return [];
  }

  const allRoles = user.memberships.flatMap((membership) => membership.roles);
  return [...new Set(allRoles)];
};
