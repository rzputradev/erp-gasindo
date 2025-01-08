'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createItemSchema } from '@/lib/schemas/item';

export async function createItem(values: z.infer<typeof createItemSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      const { success, data: parsedValues } =
         createItemSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

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
