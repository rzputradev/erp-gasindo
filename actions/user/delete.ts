'use server';

import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { deleteImage } from '@/lib/file-uploader';

export async function deleteUser(id: string) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      if (!id) return { error: 'Id is required' };

      await db.$transaction(async (tx) => {
         // Fetch the user's data to get the image URL
         const userToDelete = await tx.user.findUnique({ where: { id } });
         if (!userToDelete) return { error: 'User not found' };

         // Delete the associated image if it exists
         if (userToDelete.image) {
            try {
               await deleteImage(userToDelete.image);
            } catch (error) {
               console.error('Error deleting image:', error);
               throw new Error('Failed to delete user image');
            }
         }

         // Delete the user from the database
         await tx.user.delete({
            where: { id }
         });
      });

      revalidatePath(`/dashboard/user`);
      return { success: 'Data deleted successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
