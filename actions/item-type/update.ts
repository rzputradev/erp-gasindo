'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateItemTypeSchema } from '@/lib/schemas/item-type';

export async function updateItemType(
   values: z.infer<typeof updateItemTypeSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      const { success, data: parsedValues } =
         updateItemTypeSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, key, description } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.itemType.update({
            where: { id },
            data: { name, key, description }
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
