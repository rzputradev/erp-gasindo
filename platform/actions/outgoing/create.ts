'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { createOutgoingSchema } from '@/lib/schemas/outgoing';
import { generateTicketNo } from '@/data/outgoing';

export async function createOutgoing(
   values: z.infer<typeof createOutgoingSchema>
) {
   try {
      const user = await currentUser();

      const hasAccess = await checkPermissions(user, ['outgoing:create']);
      if (!hasAccess) {
         return { error: 'Anda tidak memiliki akses' };
      }

      const { success, data: parsedValues } =
         createOutgoingSchema.safeParse(values);
      if (!success) {
         return { error: 'Data tidak valid' };
      }

      const { driver, licenseNo, plateNo, transporter, weightIn, orderId } =
         parsedValues;

      const existingOrder = await db.order.findUnique({
         where: {
            id: orderId
         },
         include: {
            contract: {
               include: { location: true }
            }
         }
      });

      if (
         !existingOrder
      ) {
         return { error: 'Pengambilan tidak ditemukan' };
      }

      const existingVehicle = await db.outgoingScale.findFirst({
         where: {
            OR: [{ licenseNo: licenseNo }, { plateNo: plateNo }],
            exitTime: null
         }
      });

      if (existingVehicle) {
         return { error: 'Pengemudi atau kendaraan sedang dimuat' };
      }

      const locationId = existingOrder.contract?.location?.id;
      if (!locationId) {
         return { error: 'Lokasi tidak valid' };
      }

      const ticketNo = await generateTicketNo({ locationId });
      if (!ticketNo) return { error: 'Gagal membuat nomor tiket' };

      await db.$transaction(async (tx) => {
         await tx.outgoingScale.create({
            data: {
               ticketNo,
               driver,
               licenseNo,
               plateNo,
               transporter,
               weightIn,
               orderId
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
