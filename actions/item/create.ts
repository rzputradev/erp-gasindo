'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createItemSchema } from '@/lib/schemas/item';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';

export async function createItem(values: z.infer<typeof createItemSchema>) {
   try {
      const access = await checkPermissions(['item:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createItemSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, typeId, key, description, isWeighted, isSalable, unit } =
         parsedValues;

      await db.$transaction(async (tx) => {
         await tx.item.create({
            data: {
               name,
               key,
               description,
               unit,
               isWeighted,
               isSalable,
               typeId
            }
         });
      });

      revalidatePath('/dashboard/item');

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
