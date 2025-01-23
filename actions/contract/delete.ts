'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

export async function deleteContract(id: string) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['contract:delete']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      if (!id) return { error: 'Id diperlukan' };

      await db.$transaction(async (tx) => {
         await tx.contract.delete({
            where: { id }
         });
      });

      revalidatePath(`/dashboard/contract`);
      return { success: 'Data berhasil dihapus' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
