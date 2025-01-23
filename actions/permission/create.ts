'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createPermissionSchema } from '@/lib/schemas/permission';
import { checkPermissions, currentUser } from '@/data/user';

export async function createPersmission(
   values: z.infer<typeof createPermissionSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['permission:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createPermissionSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, key, description } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.permission.create({
            data: {
               name,
               key,
               description
            }
         });
      });

      revalidatePath('/dashboard/permission');

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
