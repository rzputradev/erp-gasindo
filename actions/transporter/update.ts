'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateTransporterSchema } from '@/lib/schemas/transporter';

export async function updateTransporter(
   values: z.infer<typeof updateTransporterSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         updateTransporterSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { id, name, key, locationId, phone, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.transporter.update({
            where: { id },
            data: {
               name,
               key,
               locationId,
               phone,
               address
            }
         });
      });

      revalidatePath(`/dashboard/transporter/update`);

      return { success: 'Data updated successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
