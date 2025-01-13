'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';
import { updateVehicleTypeSchema } from '@/lib/schemas/vehicle-type';

export async function updateVehicleType(
   values: z.infer<typeof updateVehicleTypeSchema>
) {
   try {
      const access = await checkPermissions(['vehicle-type:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateVehicleTypeSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, name, description, key } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.vehicleType.update({
            where: { id },
            data: {
               name,
               key,
               description
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
