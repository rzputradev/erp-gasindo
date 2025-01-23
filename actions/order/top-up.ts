'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { topUpContractSchema } from '@/lib/schemas/contract';
import { SalesStatus } from '@prisma/client';

export async function topUp(values: z.infer<typeof topUpContractSchema>) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(
         user,
         ['contract:update', 'contract:create'],
         'AND'
      );
      if (!access) {
         return { error: 'Anda tidak memiliki akses' };
      }

      const { success, data: parsedValues } =
         topUpContractSchema.safeParse(values);
      if (!success) {
         return { error: 'Data tidak valid' };
      }

      const { id, topUpQty } = parsedValues;

      const existingOrder = await db.order.findUnique({
         where: { id },
         include: { contract: true }
      });
      if (!existingOrder) {
         return { error: 'Pengambilan tidak ditemukan' };
      }

      if (existingOrder.status !== SalesStatus.ACTIVE)
         return {
            error: 'Hanya pengambilan yang aktif yang bisa melakukan isi ulang'
         };

      if (existingOrder.contract?.status !== SalesStatus.ACTIVE)
         return {
            error: 'Hanya kontrak aktif yang bisa melakukan isi ulang pengambilan'
         };

      await db.$transaction(async (tx) => {
         await tx.order.update({
            where: { id },
            data: {
               remainingQty: {
                  increment: topUpQty
               },
               topUpQty: {
                  increment: topUpQty
               },
               contract: {
                  update: {
                     remainingQty: {
                        decrement: topUpQty
                     }
                  }
               }
            }
         });
      });

      revalidatePath(`/dashboard/order/update`);

      return { success: 'Data berhasil diperbarui' };
   } catch (error) {
      console.error('Update Contract Error:', error);
      return { error: 'Terjadi kesalahan tak terduga' };
   }
}
