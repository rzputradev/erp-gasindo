'use server';

import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteTransporter(id: string) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      if (!id) return { error: 'Id is required' };

      await db.$transaction(async (tx) => {
         await tx.transporter.delete({
            where: { id }
         });
      });

      revalidatePath(`/dashboard/transporter`);
      return { success: 'Data deleted successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
