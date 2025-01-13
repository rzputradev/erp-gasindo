import { currentUser } from '@/data/user';
import { useSession } from 'next-auth/react';
import { notFound, unauthorized } from 'next/navigation';

export function useCurrentUser() {
   const session = useSession();

   return session.data?.user;
}

export function useCheckPermissions(
   requiredPermissions: string[],
   checkMode: 'AND' | 'OR' = 'OR'
): boolean {
   const user = useCurrentUser();

   if (!user) {
      return false;
   }

   const userPermissions = user.permissions || [];

   return checkMode === 'AND'
      ? requiredPermissions.every((perm) => userPermissions.includes(perm))
      : requiredPermissions.some((perm) => userPermissions.includes(perm));
}
