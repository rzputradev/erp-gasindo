'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateItemSchema } from '@/lib/schemas/item';

export async function updateItem(values: z.infer<typeof updateItemSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      const { success, data: parsedValues } =
         updateItemSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const {
         id,
         name,
         key,
         description,
         isSalable,
         isWeighted,
         unit,
         typeId
      } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.item.update({
            where: { id },
            data: {
               name,
               key,
               description,
               unit,
               typeId,
               isSalable,
               isWeighted
            }
         });
      });

      revalidatePath(`/dashboard/item-type/update`);

      return { success: 'Data berhasil diperbarui' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
