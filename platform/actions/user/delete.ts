'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { deleteImage } from '@/lib/file-uploader';

export async function deleteUser(id: string) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['user:delete']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      if (!id) return { error: 'Id diperlukan' };

      await db.$transaction(async (tx) => {
         const userToDelete = await tx.user.findUnique({ where: { id } });
         if (!userToDelete) return { error: 'User tidak ditemukan' };

         if (userToDelete.image) {
            try {
               await deleteImage(userToDelete.image);
            } catch (error) {
               console.error('Error deleting image:', error);
               throw new Error('Terjadi kesalahan saat menghapus gambar');
            }
         }

         await tx.user.delete({
            where: { id }
         });
      });

      revalidatePath(`/dashboard/user`);
      return { success: 'Data berhasil dihapus' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
