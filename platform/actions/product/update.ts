'use server';

import { z } from 'zod';
import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateSupplierSchema } from '@/lib/schemas/supplier';
import { updateProductSchema } from '@/lib/schemas/product';

export async function updateProduct(
   values: z.infer<typeof updateProductSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['product:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateProductSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, locationId, supplierId, itemId, type, price } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.supplierItem.update({
            where: { id },
            data: {
               locationId,
               supplierId,
               itemId,
               type,
               price
            }
         });
      });

      revalidatePath(`/dashboard/product/update`);

      return { success: 'Data berhasil diperbaharui' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
