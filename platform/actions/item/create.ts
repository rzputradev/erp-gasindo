'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createItemSchema } from '@/lib/schemas/item';
import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

export async function createItem(values: z.infer<typeof createItemSchema>) {
   try {
      // Check user permissions
      const user = await currentUser();
      const access = await checkPermissions(user, ['item:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      // Validate input data
      const { success, data: parsedValues } =
         createItemSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, key, description, unit, categories } = parsedValues;

      // Check for existing item with the same key
      const existingItemKey = await db.item.findUnique({ where: { key } });
      if (existingItemKey) return { error: 'Key sudah dipakai' };

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

      // Create the item and associate categories
      const item = await db.item.create({
         data: {
            name,
            key,
            description: description || null,
            unit,
            categories: {
               connect: existingCategories.map((category) => ({
                  id: category.id
               }))
            }
         }
      });

      // Revalidate relevant paths
      revalidatePath('/dashboard/item');

      return { success: 'Data berhasil disimpan', item };
   } catch (error) {
      console.error('Error creating item:', error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
