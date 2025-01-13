'use server';

import { z } from 'zod';
import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateSupplierSchema } from '@/lib/schemas/supplier';

export async function updateSupplier(
   values: z.infer<typeof updateSupplierSchema>
) {
   try {
      const access = await checkPermissions(['supplier:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateSupplierSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, key, phone, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.supplier.update({
            where: { id },
            data: { name, key, phone, address }
         });
      });

      revalidatePath(`/dashboard/supplier/update`);

      return { success: 'Data berhasil diperbaharui' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
