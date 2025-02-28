'use server';

import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { updateLocationSchema } from '@/lib/schemas/location';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

export async function updateLocation(
   values: z.infer<typeof updateLocationSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['location:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateLocationSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, key, type, address } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.location.update({
            where: { id },
            data: { name, key, type, address }
         });
      });

      revalidateTag(`/dashboard/location/update`);

      return { success: 'Data berhasil diperbaharui' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
