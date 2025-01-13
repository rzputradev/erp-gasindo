'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';
import { updateTransporterSchema } from '@/lib/schemas/transporter';

export async function updateTransporter(
   values: z.infer<typeof updateTransporterSchema>
) {
   try {
      const access = await checkPermissions(['transporter:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateTransporterSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

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

      return { success: 'Data berhasil dihapus' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
