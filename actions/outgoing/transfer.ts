'use server';

import { z } from 'zod';
import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateItemSchema } from '@/lib/schemas/item';
import {
   transferOutogingSchema,
   updateOutgoingSchema
} from '@/lib/schemas/outgoing';
import { generateTicketNo } from '@/data/outgoing';
import { SalesStatus } from '@prisma/client';

export async function transferOutgoing(
   values: z.infer<typeof transferOutogingSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['outgoing:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         transferOutogingSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { id, orderId, quantity } = parsedValues;

      const existingOutgoing = await db.outgoingScale.findUnique({
         where: { id }
      });
      if (!existingOutgoing || !existingOutgoing.weightOut)
         return { error: 'Barang keluar tidak ditemukan' };

      const finalWeight =
         existingOutgoing.weightOut - existingOutgoing.weightIn;
      if (finalWeight < quantity)
         return { error: 'Kuantitas pemindahan melebihi berat neto' };

      const existingOrder = await db.order.findUnique({
         where: {
            id: orderId,
            status: SalesStatus.ACTIVE,
            contract: {
               status: SalesStatus.ACTIVE
            }
         },
         include: {
            contract: {
               include: { location: true }
            }
         }
      });
      if (!existingOrder || existingOutgoing.orderId === existingOrder.id)
         return { error: 'Nomor pengambilan tidak ditemukan' };
      if (existingOrder.remainingQty < quantity)
         return { error: 'Berat pemindahan melebihi sisa pengambilan baru' };

      // If quantity same to final weight change the order id
      if (quantity === finalWeight) {
         await db.$transaction(async (tx) => {
            await tx.outgoingScale.update({
               where: { id },
               data: {
                  order: {
                     update: {
                        remainingQty: { increment: quantity },
                        status: SalesStatus.ACTIVE
                     }
                  }
               }
            });

            await tx.outgoingScale.update({
               where: { id },
               data: {
                  orderId
               }
            });

            await tx.order.update({
               where: {
                  id: orderId
               },
               data: {
                  remainingQty: { decrement: quantity }
               }
            });
         });
         revalidatePath(`/dashboard/outgoing/read`);

         return { success: 'Data berhasil diperbarui' };
      }
      // Else create new outgoing data with different orderId
      else {
         if (existingOutgoing.splitId)
            return { error: 'Barang keluar sudah memiliki tiket terpisah' };

         await db.$transaction(async (tx) => {
            const locationId = existingOrder.contract?.location?.id;
            if (!locationId) {
               return { error: 'Lokasi tidak valid' };
            }

            const ticketNo = await generateTicketNo({ locationId });
            if (!ticketNo) return { error: 'Gagal membuat nomor tiket' };

            await tx.outgoingScale.create({
               data: {
                  orderId,
                  ticketNo,
                  driver: existingOutgoing.driver,
                  licenseNo: existingOutgoing.licenseNo,
                  plateNo: existingOutgoing.plateNo,
                  transporter: existingOutgoing.transporter,
                  weightIn: existingOutgoing.weightOut! - quantity,
                  weightOut: existingOutgoing.weightOut! + quantity,
                  exitTime: existingOutgoing.exitTime,
                  entryTime: existingOutgoing.entryTime,
                  broken: existingOutgoing.broken,
                  moist: existingOutgoing.moist,
                  so: existingOutgoing.so,
                  sto: existingOutgoing.sto,
                  ffa: existingOutgoing.ffa,
                  dirty: existingOutgoing.dirty,
                  seal: existingOutgoing.seal,
                  fiber: existingOutgoing.fiber,
                  note: existingOutgoing.note,
                  splitId: existingOrder.id
               }
            });

            await tx.order.update({
               where: { id: orderId },
               data: {
                  remainingQty: { decrement: quantity }
               }
            });

            await tx.outgoingScale.update({
               where: { id },
               data: {
                  order: {
                     update: {
                        remainingQty: { increment: quantity },
                        status: SalesStatus.ACTIVE
                     }
                  },
                  splitOrder: { connect: { ticketNo } },
                  weightOut: existingOutgoing.weightOut! - quantity
               }
            });
         });

         revalidatePath(`/dashboard/outgoing/read`);

         return { success: 'Data berhasil diperbarui' };
      }
   } catch (error) {
      console.error('Error updating item:', error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
