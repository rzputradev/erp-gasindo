'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createTransporterSchema } from '@/lib/schemas/transporter';
import { checkPermissions } from '@/data/user';

export async function createTransporter(
   values: z.infer<typeof createTransporterSchema>
) {
   try {
      const access = await checkPermissions(['transporter:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createTransporterSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

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

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
