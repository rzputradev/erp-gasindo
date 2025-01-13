import { db } from '@/lib/db';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';

export async function getUserByEmail(email: string) {
   try {
      const user = await db.user.findUnique({
         where: {
            email
         },
         include: {
            role: {
               include: {
                  permissions: {
                     include: { permission: true }
                  }
               }
            },
            location: true
         }
      });
      return user;
   } catch {
      return null;
   }
}

export async function getUserById(id: string) {
   try {
      const user = await db.user.findUnique({
         where: { id },
         include: {
            role: {
               include: {
                  permissions: {
                     include: { permission: true }
                  }
               }
            },
            location: true
         }
      });
      return user;
   } catch {
      return null;
   }
}

export async function currentUser() {
   const session = await auth();

   return session?.user;
}

export async function checkPermissions(
   requiredPermissions: string[],
   checkMode: 'AND' | 'OR' = 'OR'
): Promise<boolean> {
   const user = await currentUser();

   if (!user) {
      return false;
   }

   const userPermissions = user.permissions || [];

   return checkMode === 'AND'
      ? requiredPermissions.every((perm) => userPermissions.includes(perm))
      : requiredPermissions.some((perm) => userPermissions.includes(perm));
}
