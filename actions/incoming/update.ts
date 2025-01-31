'use server';

import { z } from 'zod';
import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updateItemSchema } from '@/lib/schemas/item';
import { updateOutgoingSchema } from '@/lib/schemas/outgoing';

export async function updateOutgoing(
   values: z.infer<typeof updateOutgoingSchema>
) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['outgoing:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateOutgoingSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const {
         id,
         ticketNo,
         driver,
         licenseNo,
         plateNo,
         transporter,
         entryTime,
         exitTime,
         weightIn,
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
         where: { id }
      });
      if (!existingOutgoing) return { error: 'Barang keluar tidak ditemukan' };

      if (ticketNo !== existingOutgoing.ticketNo) {
         const existingItemKey = await db.outgoingScale.findUnique({
            where: { ticketNo }
         });
         if (existingItemKey) return { error: 'Nomor tiket sudah dipakai' };
      }

      await db.$transaction(async (tx) => {
         await tx.outgoingScale.update({
            where: { id },
            data: {
               ticketNo,
               driver,
               licenseNo,
               plateNo,
               transporter,
               exitTime,
               entryTime,
               weightIn,
               weightOut,
               seal,
               note,
               broken,
               moist,
               dirty,
               so,
               sto,
               ffa,
               fiber
            }
         });
      });

      revalidatePath(`/dashboard/outgoing/update`);

      return { success: 'Data berhasil diperbarui' };
   } catch (error) {
      console.error('Error updating item:', error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
