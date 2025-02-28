'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { createOutgoingSchema } from '@/lib/schemas/outgoing';
import { generateTicketNo } from '@/data/incoming';
import { createIncomingSchema } from '@/lib/schemas/incoming';
import { SupplierItemType } from '@prisma/client';

export async function createIncoming(
   values: z.infer<typeof createIncomingSchema>
) {
   try {
      const user = await currentUser();

      const hasAccess = await checkPermissions(user, ['outgoing:create']);
      if (!hasAccess) {
         return { error: 'Anda tidak memiliki akses' };
      }

      const { success, data: parsedValues } =
         createIncomingSchema.safeParse(values);
      if (!success) {
         return { error: 'Data tidak valid' };
      }

      const {
         driver,
         licenseNo,
         plateNo,
         weightIn,
         itemId,
         origin,
         vehicleType
      } = parsedValues;

      const existingSupplierItem = await db.supplierItem.findUnique({
         where: { id: itemId },
         include: {
            location: true
         }
      });

      if (!existingSupplierItem) {
         return { error: 'Produk tidak ditemukan' };
      }

      const existingVehicle = await db.incomingScale.findFirst({
         where: {
            OR: [{ licenseNo: licenseNo }, { plateNo: plateNo }],
            exitTime: null
         }
      });

      if (existingVehicle) {
         return { error: 'Pengemudi atau kendaraan sedang dimuat' };
      }

      const locationId = existingSupplierItem.location?.id;
      if (!locationId) {
         return { error: 'Lokasi tidak valid' };
      }

      const ticketNo = await generateTicketNo({ locationId });
      if (!ticketNo) return { error: 'Gagal membuat nomor tiket' };

      await db.$transaction(async (tx) => {
         await tx.incomingScale.create({
            data: {
               ticketNo,
               itemId,
               driver,
               licenseNo,
               plateNo,
               weightIn,
               vehicleType,
               origin,
               price:
                  existingSupplierItem.type === SupplierItemType.WEIGH
                     ? existingSupplierItem.price
                     : null
            }
         });
      });

      revalidatePath('/dashboard/outgoing');

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error('Error in createOutgoing:', error);
      return {
         error: 'Terjadi kesalahan tak terduga. Silakan coba lagi nanti.'
      };
   }
}
