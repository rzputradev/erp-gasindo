'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { createLocationSchema } from '@/lib/schemas/location';
import { revalidatePath } from 'next/cache';

export async function createLocation(
   values: z.infer<typeof createLocationSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         createLocationSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { name, key, type, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.location.create({
            data: {
               name,
               key,
               address,
               type
            }
         });
      });

      revalidatePath('/dashboard/location');

      return { success: 'Data saved successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
