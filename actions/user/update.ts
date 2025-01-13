'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import { revalidateTag } from 'next/cache';

import { checkPermissions } from '@/data/user';
import { db } from '@/lib/db';
import { updateUserSchema } from '@/lib/schemas/user';
import { saveImage, deleteImage } from '@/lib/file-uploader';

export async function updateUser(values: z.infer<typeof updateUserSchema>) {
   try {
      const access = await checkPermissions(['user:update']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         updateUserSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const {
         id,
         name,
         email,
         gender,
         password,
         locationId,
         roleId,
         image,
         status,
         confirm_password
      } = parsedValues;

      if (password !== confirm_password) {
         return { error: 'Password tidak cocok' };
      }

      const existingUser = await db.user.findUnique({ where: { id } });
      if (!existingUser) return { error: 'Pengguna tidak ditemukan' };

      const existingEmail = await db.user.findUnique({ where: { email } });
      if (existingEmail && existingEmail.id !== id) {
         return { error: 'Email sudah digunakan' };
      }

      let imageUrl = existingUser.image;
      if (image) {
         try {
            if (imageUrl) {
               await deleteImage(imageUrl);
            }

            imageUrl = await saveImage(image);
         } catch (error) {
            console.error('Error handling image:', error);
            return { error: 'Gagal mengunggah gambar' };
         }
      }

      const updateData: Record<string, unknown> = {
         locationId: locationId === 'none' ? null : locationId || undefined,
         roleId: roleId === 'none' ? null : roleId || undefined,
         name,
         email,
         gender,
         status,
         image: imageUrl
      };

      if (password) {
         updateData.password = await hash(password, 10);
      }

      await db.user.update({
         where: { id },
         data: updateData
      });

      revalidateTag(`/dashboard/user/update`);

      return { success: 'Data barhasil diperbaharui' };
   } catch (error) {
      console.error(error);
      return { error: 'Terjadi kesalahan tak terduga' };
   }
}
