'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { updateContracSchema } from '@/lib/schemas/contract';

export async function updateContract(
   values: z.infer<typeof updateContracSchema>
) {
   try {
      // Check permissions
      const user = await currentUser();
      const access = await checkPermissions(user, ['contract:update']);
      if (!access) {
         return { error: 'Anda tidak memiliki akses' };
      }

      // Validate input data
      const { success, data: parsedValues } =
         updateContracSchema.safeParse(values);
      if (!success) {
         return { error: 'Data tidak valid' };
      }

      const {
         id,
         contractNo,
         buyerId,
         itemId,
         locationId,
         status,
         price,
         terms,
         tolerance,
         vat,
         updateTolerance,
         quantity,
         remainingQty,
         toleranceWeigh,
         topUpQty
      } = parsedValues;

      // Check if the contract exists
      const existingContract = await db.contract.findUnique({ where: { id } });
      if (!existingContract) {
         return { error: 'Kontrak tidak ditemukan.' };
      }

      if (contractNo !== existingContract.contractNo) {
         const existingContractNo = await db.contract.findUnique({
            where: { contractNo }
         });
         if (existingContractNo)
            return { error: 'Nomor kontrak sudah dipakai' };
      }

      let newToleranceWeigh = toleranceWeigh;

      if (updateTolerance) {
         newToleranceWeigh = (quantity || 0) * ((tolerance ?? 0) / 100);
      }

      // Update the contract in a transaction
      await db.$transaction(async (tx) => {
         await tx.contract.update({
            where: { id },
            data: {
               buyerId,
               itemId,
               locationId,
               status,
               price,
               terms,
               tolerance,
               toleranceWeigh: newToleranceWeigh,
               remainingQty,
               vat,
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
