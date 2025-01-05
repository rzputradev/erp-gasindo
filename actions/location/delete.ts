'use server';

import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteLocation(id: string) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      if (!id) return { error: 'Id is required' };

      await db.$transaction(async (tx) => {
         await tx.location.delete({
            where: { id }
         });
      });

      revalidatePath(`/dashboard/location`);
      return { success: 'Data deleted successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
