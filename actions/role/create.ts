'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { createRoleSchema } from '@/lib/schemas/role';
import { revalidatePath } from 'next/cache';

export async function createRole(values: z.infer<typeof createRoleSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         createRoleSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { name, key, description, permissions } = parsedValues;

      await db.$transaction(async (tx) => {
         // Create the Role
         const role = await tx.role.create({
            data: {
               name,
               key,
               description
            }
         });

         // Associate Permissions with the Role
         if (permissions && permissions.length > 0) {
            await tx.rolePermission.createMany({
               data: permissions.map((permissionId) => ({
                  roleId: role.id,
                  permissionId
               }))
            });
         }
      });

      revalidatePath(`/dashboard/role`);

      return { success: 'Role created successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
