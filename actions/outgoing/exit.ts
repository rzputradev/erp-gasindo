'use server';

import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { exitOutgoingSchema } from '@/lib/schemas/outgoing';
import { formatNumber } from '@/lib/utils';
import { SalesStatus } from '@prisma/client';

function generateTicketNo(
   nextOutgoingNo: number,
   locationKey: string,
   currentYear: number
): string {
   return `OUT-${nextOutgoingNo}-${locationKey}/${currentYear}`;
}

export async function exitOutgoing(values: z.infer<typeof exitOutgoingSchema>) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['outgoing:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         exitOutgoingSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const {
         id,
         splitOrderNo,
         weightOut,
         seal,
         note,
         broken,
         dirty,
         ffa,
         fiber,
         moist,
         so,
         sto
      } = parsedValues;

      const existingOutgoing = await db.outgoingScale.findUnique({
         where: { id },
         include: {
            order: {
               include: { contract: { include: { location: true } } }
            }
         }
      });
      if (
         !existingOutgoing ||
         existingOutgoing.order?.contract?.location?.key !== user?.location
      ) {
         return { error: 'Barang keluar tidak ditemukan' };
      }
      if (existingOutgoing.exitTime)
         return { error: 'Kendaraan telah dikeluarkan' };

      const finalWeight = weightOut - existingOutgoing.weightIn;
      const remainingQty = existingOutgoing.order?.remainingQty || 0;

      if (weightOut <= existingOutgoing.weightIn) {
         return {
            error: 'Berat tara tidak boleh lebih besar dari berat bruto'
         };
      }

      if (finalWeight > remainingQty) {
         if (!splitOrderNo) {
            return {
               error: `Kuantitas pengambilan melebihi sisa kuantitas sampai ${formatNumber(finalWeight - remainingQty)}Kg, Silahkan hubungi admin untuk mengajukan isi ulang sisa kuantitas atau minta nomor pengambilan terpisah`
            };
         }

         if (splitOrderNo == existingOutgoing.order?.orderNo) {
            return { error: 'Nomor pengambilan terpisah tidak valid' };
         }

         const existingSplitOrder = await db.order.findUnique({
            where: {
               orderNo: splitOrderNo,
               status: SalesStatus.ACTIVE,
               contract: {
                  status: SalesStatus.ACTIVE,
                  locationId: existingOutgoing.order?.contract?.locationId,
                  buyerId: existingOutgoing.order?.contract?.buyerId,
                  itemId: existingOutgoing.order?.contract?.itemId
               }
            }
         });

         if (!existingSplitOrder)
            return { error: 'Pengambilan terpisah tidak ditemukan' };

         const splitOrderFinalWeight =
            finalWeight - (existingOutgoing.order?.remainingQty || 0);

         if (splitOrderFinalWeight > (existingSplitOrder.remainingQty || 0)) {
            return {
               error: `Pengambilan melebihi sisa kuantitas pengambilan terpisah sampai ${splitOrderFinalWeight - (existingSplitOrder?.remainingQty || 0)}Kg, Silahkan hubungi admin untuk mengajukan isi ulang sisa kuantitas`
            };
         }

         const currentYear = new Date().getFullYear();

         const location = existingOutgoing.order?.contract?.location;
         if (!location?.key || !location.id) {
            return { error: 'Lokasi tidak valid' };
         }

         const outgoingCount = await db.outgoingScale.count({
            where: {
               order: {
                  contract: {
                     locationId: location.id
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
            location.key,
            currentYear
         );

         await db.$transaction(async (tx) => {
            const newOutgoing = await tx.outgoingScale.create({
               data: {
                  orderId: existingSplitOrder.id,
                  ticketNo,
                  plateNo: existingOutgoing.plateNo,
                  splitId: id,
                  driver: existingOutgoing.driver,
                  licenseNo: existingOutgoing.licenseNo,
                  transporter: existingOutgoing.transporter,
                  entryTime: existingOutgoing.entryTime,
                  exitTime: new Date(),
                  weightIn:
                     existingOutgoing.weightIn +
                     existingOutgoing.order!.remainingQty,
                  weightOut:
                     existingOutgoing.weightIn +
                     existingOutgoing.order!.remainingQty +
                     splitOrderFinalWeight,
                  seal,
                  fiber,
                  moist,
                  broken,
                  dirty,
                  ffa,
                  sto,
                  so,
                  note
               }
            });

            await tx.outgoingScale.update({
               where: { id },
               data: {
                  weightOut: finalWeight - splitOrderFinalWeight,
                  exitTime: new Date(),
                  splitId: newOutgoing.id,
                  seal,
                  fiber,
                  moist,
                  broken,
                  dirty,
                  ffa,
                  sto,
                  so,
                  note
               }
            });

            await tx.order.update({
               where: { id: existingOutgoing.order?.id },
               data: {
                  remainingQty: {
                     decrement: existingOutgoing.order?.remainingQty
                  }
               }
            });

            await tx.order.update({
               where: { id: existingSplitOrder.id },
               data: {
                  remainingQty: {
                     decrement: splitOrderFinalWeight
                  }
               }
            });
         });

         revalidatePath('/dashboard/outgoing/exit');
         return {
            success:
               'Data berhasil diperbarui menggunakan nomor pengambilan terpisah'
         };
      }

      await db.$transaction(async (tx) => {
         await tx.outgoingScale.update({
            where: { id },
            data: {
               weightOut,
               exitTime: new Date(),
               seal,
               broken,
               moist,
               dirty,
               so,
               sto,
               ffa,
               fiber,
               note
            }
         });

         await tx.order.update({
            where: { id: existingOutgoing.order?.id },
            data: {
               remainingQty: {
                  decrement: finalWeight
               }
            }
         });
      });

      revalidatePath(`/dashboard/outgoing/exit`);

      return { success: 'Data berhasil diperbarui' };
   } catch (error) {
      console.error('Error updating item:', error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
