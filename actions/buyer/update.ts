'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updatePermissionSchema } from '@/lib/schemas/permission';
import { updateBuyerSchema } from '@/lib/schemas/buyer';

export async function updateBuyer(values: z.infer<typeof updateBuyerSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         updateBuyerSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { id, name, key, tin, phone, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.buyer.update({
            where: { id },
            data: { name, key, tin, phone, address }
         });
      });

      revalidatePath(`/dashboard/permission/update`);

      return { success: 'Data updated successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
