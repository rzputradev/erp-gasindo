'use server';

import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteVehicleType(id: string) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      if (!id) return { error: 'Id diperlukan' };

      await db.$transaction(async (tx) => {
         await tx.vehicleType.delete({
            where: { id }
         });
      });

      revalidatePath(`/dashboard/vehicle-type`);

      return { success: 'Data berhasil dihapus' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
