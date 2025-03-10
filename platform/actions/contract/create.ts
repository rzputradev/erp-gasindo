'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { createContractSchema } from '@/lib/schemas/contract';
import { monthToRoman } from '@/lib/utils';

function generateContractNo(
   nextContractNo: number,
   buyerKey: string,
   locationKey: string,
   itemKey: string
): string {
   const originalCompanyName = process.env.NEXT_PUBLIC_COMPANY_SHORT_NAME || '';
   const transformedCompanyName = originalCompanyName
      .toUpperCase()
      .replace(/\s+/g, '');
   const currentYear = new Date().getFullYear();
   const currentMonthIndex = new Date().getMonth();
   const currentRomanMonth = monthToRoman[currentMonthIndex];
   const contractIndex = nextContractNo.toString().padStart(3, '0');

   return `${contractIndex}/${transformedCompanyName}-${buyerKey}/${locationKey}/${itemKey}/${currentRomanMonth}/${currentYear}`;
}

export async function createContract(
   values: z.infer<typeof createContractSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['contract:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createContractSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const {
         buyerId,
         itemId,
         locationId,
         price,
         terms,
         tolerance,
         quantity,
         vat
      } = parsedValues;
      const currentYear = new Date().getFullYear();

      const contractCount = await db.contract.count({
         where: {
            buyerId,
            itemId,
            createdAt: {
               gte: new Date(`${currentYear}-01-01T00:00:00Z`),
               lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
            }
         }
      });

      const newContractNumber = contractCount + 1;

      const location = await db.location.findUnique({
         where: { id: locationId }
      });
      const buyer = await db.buyer.findUnique({ where: { id: buyerId } });
      const item = await db.item.findUnique({ where: { id: itemId } });

      if (!location || !buyer || !item)
         return { error: 'Data tidak ditemukan' };

      const contractNo = generateContractNo(
         newContractNumber,
         buyer.key,
         location.key,
         item.key
      );
      const toleranceWeigh = (quantity ?? 0) * ((tolerance ?? 0) / 100);

      await db.$transaction(async (tx) => {
         await tx.contract.create({
            data: {
               locationId,
               buyerId,
               itemId,
               contractNo,
               vat,
               price: price,
               quantity: quantity,
               remainingQty: quantity,
               tolerance,
               toleranceWeigh,
               terms
            }
         });
      });

      revalidatePath(`/dashboard/contract`);

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
