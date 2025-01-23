'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { createOutgoingSchema } from '@/lib/schemas/outgoing';

function generateTicketNo(
   nextOutgoingNo: number,
   locationKey: string,
   currentYear: number
): string {
   return `OUT-${nextOutgoingNo}-${locationKey}/${currentYear}`;
}

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
         !existingOrder ||
         existingOrder.contract?.location?.key != user?.location
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

      const locationKey = existingOrder.contract?.location?.key;
      if (!locationKey) {
         return { error: 'Lokasi tidak valid' };
      }

      const currentYear = new Date().getFullYear();

      // Count existing outgoing records for the location
      const outgoingCount = await db.outgoingScale.count({
         where: {
            order: {
               contract: {
                  locationId: existingOrder.contract?.locationId
               }
            },
            createdAt: {
               gte: new Date(`${currentYear}-01-01T00:00:00Z`),
               lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
            }
         }
      });

      const ticketNo = generateTicketNo(
         outgoingCount + 1,
         locationKey,
         currentYear
      );

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
