'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { updateRoleSchema } from '@/lib/schemas/role';
import { revalidateTag } from 'next/cache';

export async function updateRole(values: z.infer<typeof updateRoleSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         updateRoleSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { id, name, key, description, permissions } = parsedValues;

      await db.$transaction(async (tx) => {
         // Update the role
         await tx.role.update({
            where: { id },
            data: {
               name,
               key,
               description
            }
         });

         // Clear existing permissions for the role
         await tx.rolePermission.deleteMany({
            where: { roleId: id }
         });

         // Add the updated permissions
         if (permissions && permissions.length > 0) {
            await tx.rolePermission.createMany({
               data: permissions.map((permissionId: string) => ({
                  roleId: id,
                  permissionId
               }))
            });
         }
      });

      revalidateTag(`/dashboard/role/update?id=${id}`);

      return { success: 'Role and permissions updated successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
