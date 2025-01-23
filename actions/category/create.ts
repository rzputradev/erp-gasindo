'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createCategorySchema } from '@/lib/schemas/category';
import { checkPermissions, currentUser } from '@/data/user';

export async function createItemCategory(
   values: z.infer<typeof createCategorySchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['category:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createCategorySchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, key, description } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.itemCategory.create({
            data: {
               name,
               key,
               description
            }
         });
      });

      revalidatePath('/dashboard/item-type');

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
