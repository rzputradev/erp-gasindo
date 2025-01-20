'use server';

import { z } from 'zod';
import { checkPermissions } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateCategorySchema } from '@/lib/schemas/category';

export async function updateItemCategory(
   values: z.infer<typeof updateCategorySchema>
) {
   try {
      const access = await checkPermissions(['category:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateCategorySchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, key, description } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.itemCategory.update({
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
