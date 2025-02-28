'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { createSupplierSchema } from '@/lib/schemas/supplier';
import { createProductSchema } from '@/lib/schemas/product';

export async function createProduct(
   values: z.infer<typeof createProductSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['product:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createProductSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { locationId, supplierId, itemId, type, price } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.supplierItem.create({
            data: {
               locationId,
               supplierId,
               itemId,
               type,
               price
            }
         });
      });

      revalidatePath(`/dashboard/product`);

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
