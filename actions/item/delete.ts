'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';

export async function deleteItem(id: string) {
   try {
      // Check permissions
      const access = await checkPermissions(['item:delete']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      // Validate the input
      if (!id) return { error: 'Id diperlukan' };

      // Check if the item exists
      const existingItem = await db.item.findUnique({ where: { id } });
      if (!existingItem) return { error: 'Item tidak ditemukan' };

      // Handle deletion in a transaction to manage related data
      await db.$transaction(async (tx) => {
         // Disconnect associations (e.g., categories)
         await tx.item.update({
            where: { id },
            data: {
               categories: {
                  set: [] // Disconnect all related categories
               }
            }
         });

         // Delete the item
         await tx.item.delete({
            where: { id }
         });
      });

      // Revalidate the relevant path
      revalidatePath(`/dashboard/item`);

      return { success: 'Data berhasil dihapus' };
   } catch (error) {
      console.error('Error deleting item:', error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
