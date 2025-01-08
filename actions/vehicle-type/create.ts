'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createVehicleTypeSchema } from '@/lib/schemas/vehicle-type';

export async function createVehicleType(
   values: z.infer<typeof createVehicleTypeSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      const { success, data: parsedValues } =
         createVehicleTypeSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, description, loadingCost, unloadingCost } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.vehicleType.create({
            data: {
               name,
               description,
               loadingCost,
               unloadingCost
            }
         });
      });

      revalidatePath('/dashboard/vehicle-type');

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
