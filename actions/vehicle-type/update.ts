'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateVehicleTypeSchema } from '@/lib/schemas/vehicle-type';

export async function updateVehicleType(
   values: z.infer<typeof updateVehicleTypeSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      const { success, data: parsedValues } =
         updateVehicleTypeSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, description, loadingCost, unloadingCost } =
         parsedValues;

      await db.$transaction(async (tx) => {
         await tx.vehicleType.update({
            where: { id },
            data: {
               name,
               description,
               loadingCost,
               unloadingCost
            }
         });
      });

      revalidatePath(`/dashboard/vehicle-type/update`);

      return { success: 'Data berhasil diperbarui' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
