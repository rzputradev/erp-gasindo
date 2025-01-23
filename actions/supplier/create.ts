'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { createSupplierSchema } from '@/lib/schemas/supplier';

export async function createSupplier(
   values: z.infer<typeof createSupplierSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['supplier:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createSupplierSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, key, phone, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.supplier.create({
            data: {
               name,
               key,
               phone,
               address
            }
         });
      });

      revalidatePath(`/dashboard/supplier`);

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
