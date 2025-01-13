'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { unauthorized } from 'next/navigation';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';
import { createBuyerSchema } from '@/lib/schemas/buyer';

export async function createBuyer(values: z.infer<typeof createBuyerSchema>) {
   try {
      const access = await checkPermissions(['buyer:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createBuyerSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, key, tin, phone, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.buyer.create({
            data: {
               name,
               key,
               tin,
               phone,
               address
            }
         });
      });

      revalidatePath(`/dashboard/buyer`);

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
