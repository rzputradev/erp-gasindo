'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { updateContracSchema } from '@/lib/schemas/contract';
import { updateOrderSchema } from '@/lib/schemas/order';
import { SalesStatus } from '@prisma/client';

export async function updateOrder(values: z.infer<typeof updateOrderSchema>) {
   try {
      // Check permissions
      const user = await currentUser();
      const access = await checkPermissions(user, ['order:update']);
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
      const existingOrder = await db.order.findUnique({
         where: { id },
         include: { contract: true }
      });
      if (!existingOrder) {
         return { error: 'Pengambilan tidak ditemukan.' };
      }

      if (orderNo !== existingOrder.orderNo) {
         const existingOrderNo = await db.order.findUnique({
            where: { orderNo }
         });
         if (existingOrderNo)
            return { error: 'Nomor pengambilan sudah dipakai' };
      }

      if (existingOrder.contract?.status !== SalesStatus.ACTIVE)
         return {
            error: 'Hanya kontrak aktif yang bisa melakukan isi ulang pengambilan'
         };

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
