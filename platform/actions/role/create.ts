'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createRoleSchema } from '@/lib/schemas/role';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

export async function createRole(values: z.infer<typeof createRoleSchema>) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['role:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createRoleSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, key, description, permissions } = parsedValues;

      await db.$transaction(async (tx) => {
         const role = await tx.role.create({
            data: {
               name,
               key,
               description
            }
         });

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

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
