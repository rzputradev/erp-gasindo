'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { createRoleSchema } from '@/lib/schemas/role';
import { revalidatePath } from 'next/cache';
import { createBuyerSchema } from '@/lib/schemas/buyer';

export async function createBuyer(values: z.infer<typeof createBuyerSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         createBuyerSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { name, key, tin, phone, address } = parsedValues;

      await db.$transaction(async (tx) => {
         const role = await tx.buyer.create({
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

      return { success: 'Data created successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
