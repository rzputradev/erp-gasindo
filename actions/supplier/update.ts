'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateSupplierSchema } from '@/lib/schemas/supplier';

export async function updateSupplier(
   values: z.infer<typeof updateSupplierSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         updateSupplierSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { id, name, key, phone, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.supplier.update({
            where: { id },
            data: { name, key, phone, address }
         });
      });

      revalidatePath(`/dashboard/supplier/update`);

      return { success: 'Data updated successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
