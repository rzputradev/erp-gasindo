'use server';

import { z } from 'zod';
import { checkPermissions } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateItemSchema } from '@/lib/schemas/item';

export async function updateItem(values: z.infer<typeof updateItemSchema>) {
   try {
      // Check permissions
      const access = await checkPermissions(['item:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      // Validate incoming data
      const { success, data: parsedValues } =
         updateItemSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, key, description, unit, categories } = parsedValues;

      // Check if the item exists
      const existingItem = await db.item.findUnique({ where: { id } });
      if (!existingItem) return { error: 'Item tidak ditemukan' };

      // Check for duplicate key (if it has changed)
      if (key !== existingItem.key) {
         const existingItemKey = await db.item.findUnique({ where: { key } });
         if (existingItemKey) return { error: 'Key sudah dipakai' };
      }

      // Validate categories
      const existingCategories = categories
         ? await db.itemCategory.findMany({
              where: {
                 id: { in: categories }
              }
           })
         : [];

      if (categories && existingCategories.length !== categories.length) {
         return { error: 'Ada kategori yang tidak valid' };
      }

      // Update the item in a transaction
      await db.$transaction(async (tx) => {
         // Update the item details
         await tx.item.update({
            where: { id },
            data: {
               name,
               key,
               description: description || null, // Handle optional empty strings
               unit
            }
         });

         // Update categories association
         if (categories) {
            await tx.item.update({
               where: { id },
               data: {
                  categories: {
                     set: existingCategories.map((category) => ({
                        id: category.id
                     })) // Replace associations
                  }
               }
            });
         }
      });

      // Revalidate relevant paths
      revalidatePath(`/dashboard/item/update`);

      return { success: 'Data berhasil diperbarui' };
   } catch (error) {
      console.error('Error updating item:', error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
