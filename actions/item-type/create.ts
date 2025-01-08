'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createItemTypeSchema } from '@/lib/schemas/item-type';

export async function createItemType(
   values: z.infer<typeof createItemTypeSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      const { success, data: parsedValues } =
         createItemTypeSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, key, description } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.itemType.create({
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
