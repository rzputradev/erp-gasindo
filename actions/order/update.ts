'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { checkPermissions } from '@/data/user';
import { db } from '@/lib/db';
import { updateContracSchema } from '@/lib/schemas/contract';
import { updateOrderSchema } from '@/lib/schemas/order';

export async function updateOrder(values: z.infer<typeof updateOrderSchema>) {
   try {
      // Check permissions
      const access = await checkPermissions(['order:update']);
      if (!access) {
         return { error: 'Anda tidak memiliki akses' };
      }

      // Validate input data
      const parsed = updateOrderSchema.safeParse(values);
      if (!parsed.success) {
         return { error: 'Data tidak valid', details: parsed.error.errors };
      }

      const { id, orderNo, quantity, remainingQty, status, topUpQty } =
         parsed.data;
      // Check if the contract exists
      const existingOrder = await db.order.findUnique({ where: { id } });
      if (!existingOrder) {
         return { error: 'Pengambilan tidak ditemukan.' };
      }

      // Update the contract in a transaction
      await db.$transaction(async (tx) => {
         await tx.order.update({
            where: { id },
            data: {
               orderNo,
               quantity,
               remainingQty,
               status,
               topUpQty
            }
         });
      });

      // Revalidate relevant path
      revalidatePath(`/dashboard/contract/update`);

      return { success: 'Data kontrak berhasil diperbarui.' };
   } catch (error) {
      console.error('Update Contract Error:', error);
      return {
         error: 'Terjadi kesalahan tak terduga. Silakan coba lagi nanti.'
      };
   }
}
