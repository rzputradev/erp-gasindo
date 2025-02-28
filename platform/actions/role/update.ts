'use server';

import { z } from 'zod';
import { revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { updateRoleSchema } from '@/lib/schemas/role';
import { checkPermissions, currentUser } from '@/data/user';

export async function updateRole(values: z.infer<typeof updateRoleSchema>) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['role:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateRoleSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, key, description, permissions } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.role.update({
            where: { id },
            data: {
               name,
               key,
               description
            }
         });

         await tx.rolePermission.deleteMany({
            where: { roleId: id }
         });

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

      return { success: 'Data berhasil diperbaharui' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
