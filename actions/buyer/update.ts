'use server';

import { z } from 'zod';
import { updateBuyerSchema } from '@/lib/schemas/buyer';
import { revalidatePath } from 'next/cache';

import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';

export async function updateBuyer(values: z.infer<typeof updateBuyerSchema>) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['buyer:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateBuyerSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, key, tin, phone, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.buyer.update({
            where: { id },
            data: { name, key, tin, phone, address }
         });
      });

      revalidatePath(`/dashboard/buyer/update`);

      return { success: 'Data berhasil diperbaharui' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
