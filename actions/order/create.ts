'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { createContractSchema } from '@/lib/schemas/contract';
import { monthToRoman } from '@/lib/utils';
import { createOrderSchema } from '@/lib/schemas/order';

function generateOrderNo(
   nextOrderNo: number,
   buyerKey: string,
   itemKey: string
): string {
   const originalCompanyName = process.env.NEXT_PUBLIC_COMPANY_SHORT_NAME || '';
   const transformedCompanyName = originalCompanyName
      .toUpperCase()
      .replace(/\s+/g, '');
   const currentYear = new Date().getFullYear();
   const currentMonthIndex = new Date().getMonth();
   const currentRomanMonth = monthToRoman[currentMonthIndex];
   const contractIndex = nextOrderNo.toString().padStart(3, '0');

   return `${contractIndex}/${transformedCompanyName}-${buyerKey}.${itemKey}/${currentRomanMonth}/${currentYear}`;
}

export async function createOrder(values: z.infer<typeof createOrderSchema>) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['order:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createOrderSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { contractId, quantity } = parsedValues;
      const currentYear = new Date().getFullYear();

      const existingContract = await db.contract.findUnique({
         where: { id: contractId },
         include: {
            item: true,
            buyer: true
         }
      });

      if (!existingContract) return { error: 'Kontrak tidak ditemukan' };

      if (existingContract.remainingQty - quantity < 0)
         return {
            error: 'Kuantitas pengambilan melebihi sisa kuantitas kontrak'
         };

      const orderCount = await db.order.count({
         where: {
            contract: {
               buyerId: existingContract.buyerId,
               itemId: existingContract.itemId
            },
            createdAt: {
               gte: new Date(`${currentYear}-01-01T00:00:00Z`),
               lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
            }
         }
      });

      const newOrderNumber = orderCount + 1;

      const orderNo = generateOrderNo(
         newOrderNumber,
         existingContract.buyer?.key!,
         existingContract.item?.key!
      );

      console.log(orderNo);

      await db.$transaction(async (tx) => {
         await tx.order.create({
            data: {
               contractId,
               orderNo,
               quantity,
               remainingQty: quantity
            }
         });

         await tx.contract.update({
            where: { id: existingContract.id },
            data: {
               remainingQty: {
                  decrement: quantity
               }
            }
         });
      });

      revalidatePath(`/dashboard/order`);

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
