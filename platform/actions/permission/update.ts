'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { updatePermissionSchema } from '@/lib/schemas/permission';

export async function updatePermission(
   values: z.infer<typeof updatePermissionSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['permission:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updatePermissionSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { id, name, key, description } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.permission.update({
            where: { id },
            data: { name, key, description }
         });
      });

      revalidatePath(`/dashboard/permission/update`);

      return { success: 'Data berhasil diperbaharui' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
