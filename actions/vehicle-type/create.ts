'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';
import { createVehicleTypeSchema } from '@/lib/schemas/vehicle-type';

export async function createVehicleType(
   values: z.infer<typeof createVehicleTypeSchema>
) {
   try {
      const access = await checkPermissions(['vehicle-type:read']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createVehicleTypeSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, description, key } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.vehicleType.create({
            data: {
               name,
               description,
               key
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
