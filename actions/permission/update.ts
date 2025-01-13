'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';
import { updatePermissionSchema } from '@/lib/schemas/permission';

export async function updatePermission(
   values: z.infer<typeof updatePermissionSchema>
) {
   try {
      const access = await checkPermissions(['permission:update']);
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
