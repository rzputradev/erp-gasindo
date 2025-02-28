import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

export function useCurrentUser() {
   const session = useSession();

   return session.data?.user;
}

export function useCheckPermissions(
   user: User | undefined,
   requiredPermissions: string[],
   checkMode: 'AND' | 'OR' = 'OR'
): boolean {
   if (!user) return false;

   const userPermissions = user.permissions || [];

   return checkMode === 'AND'
      ? requiredPermissions.every((perm) => userPermissions.includes(perm))
      : requiredPermissions.some((perm) => userPermissions.includes(perm));
}
