'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { updateLocationSchema } from '@/lib/schemas/location';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateLocation(
   values: z.infer<typeof updateLocationSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         updateLocationSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { id, name, key, type, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.location.update({
            where: { id },
            data: { name, key, type, address }
         });
      });

      revalidateTag(`/dashboard/location/update?id=${id}`);

      return { success: 'Data updated successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
