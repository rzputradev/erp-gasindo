'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createItemTypeSchema } from '@/lib/schemas/item-type';
import { checkPermissions } from '@/data/user';

export async function createItemCategory(
   values: z.infer<typeof createItemTypeSchema>
) {
   try {
      const access = await checkPermissions(['item-type:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createItemTypeSchema.safeParse(values);
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
