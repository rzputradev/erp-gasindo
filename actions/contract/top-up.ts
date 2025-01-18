'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { checkPermissions } from '@/data/user';
import { db } from '@/lib/db';
import { topUpContractSchema } from '@/lib/schemas/contract';
import { SalesStatus } from '@prisma/client';

export async function topUp(values: z.infer<typeof topUpContractSchema>) {
   try {
      // Check user permissions
      const access = await checkPermissions(
         ['contract:update', 'contract:create'],
         'AND'
      );
      if (!access) {
         return { error: 'Anda tidak memiliki akses' };
      }

      // Validate input data using Zod schema
      const { success, data: parsedValues } =
         topUpContractSchema.safeParse(values);
      if (!success) {
         return { error: 'Data tidak valid' };
      }

      const { id, topUpQty } = parsedValues;

      // Fetch the existing contract from the database
      const existingContract = await db.contract.findUnique({ where: { id } });
      if (!existingContract) {
         return { error: 'Kontrak tidak ditemukan' };
      }

      if (existingContract.status !== SalesStatus.ACTIVE) {
         return { error: 'Hanya kontrak aktif yang bisa melakukan isi ulang' };
      }

      // Update the contract in a transaction
      await db.$transaction(async (tx) => {
         await tx.contract.update({
            where: { id },
            data: {
               remainingQty: {
                  increment: topUpQty
               },
               topUpQty: {
                  increment: topUpQty
               }
            }
         });
      });

      // Revalidate the relevant path to refresh data
      revalidatePath(`/dashboard/contract/update`);

      return { success: 'Data berhasil diperbarui' };
   } catch (error) {
      console.error('Update Contract Error:', error);
      return { error: 'Terjadi kesalahan tak terduga' };
   }
}
