'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createTransporterSchema } from '@/lib/schemas/transporter';

export async function createTransporter(
   values: z.infer<typeof createTransporterSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         createTransporterSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { name, key, locationId, address, phone } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.transporter.create({
            data: {
               name,
               key,
               locationId,
               phone,
               address
            }
         });
      });

      revalidatePath('/dashboard/transporter');

      return { success: 'Data saved successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
