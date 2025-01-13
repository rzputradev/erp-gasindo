'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';
import { createLocationSchema } from '@/lib/schemas/location';

export async function createLocation(
   values: z.infer<typeof createLocationSchema>
) {
   try {
      const access = await checkPermissions(['location:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createLocationSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

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

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
