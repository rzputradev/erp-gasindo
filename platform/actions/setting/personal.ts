'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { updatePersonalSchema } from '@/lib/schemas/setting';
import { deleteImage, saveImage } from '@/lib/file-uploader';

export async function updatePersonal(
   values: z.infer<typeof updatePersonalSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      const { success, data: parsedValues } =
         updatePersonalSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { name, id, gender, image } = parsedValues;

      const existingUser = await db.user.findUnique({ where: { id } });
      if (!existingUser) return { error: 'Pengguna tidak ditemukan' };

      let imageUrl = existingUser.image;
      if (image) {
         try {
            if (imageUrl) {
               await deleteImage(imageUrl);
            }

            imageUrl = await saveImage(image);
         } catch (error) {
            console.error('Error handling image:', error);
            return { error: 'Penggunggahan file gagal' };
         }
      }

      await db.$transaction(async (tx) => {
         await tx.user.update({
            where: { id },
            data: {
               name,
               gender,
               image: imageUrl
            }
         });
      });

      revalidatePath('/dashboard/personal');

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
