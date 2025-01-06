'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { updateUserSchema } from '@/lib/schemas/user';
import { revalidateTag } from 'next/cache';
import { saveImage, deleteImage } from '@/lib/file-uploader';

export async function updateUser(values: z.infer<typeof updateUserSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak ter authentikasi' };

      const { success, data: parsedValues } =
         updateUserSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid', details: parsedValues };

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
         return { error: 'Password dan konfirmasi password tidak sama' };
      }

      // Fetch the existing user data
      const existingUser = await db.user.findUnique({ where: { id } });
      if (!existingUser) return { error: 'Pengguna tidak ditemukan' };

      // Check if the email already exists (except for the current user)
      const existingEmail = await db.user.findUnique({ where: { email } });
      if (existingEmail && existingEmail.id !== id) {
         return { error: 'Email sudah digunakan' };
      }

      // Handle image upload and replacement
      let imageUrl = existingUser.image; // Current image URL
      if (image) {
         try {
            // If there is an existing image, delete it
            if (imageUrl) {
               await deleteImage(imageUrl);
            }

            // Save the new image
            imageUrl = await saveImage(image);
         } catch (error) {
            console.error('Error handling image:', error);
            return { error: 'Penggunggahan file gagal' };
         }
      }

      // Prepare update data
      const updateData: Record<string, unknown> = {
         locationId: locationId || undefined,
         roleId: roleId || undefined,
         name,
         email,
         gender,
         status,
         image: imageUrl
      };

      // Hash password if provided
      if (password) {
         updateData.password = await hash(password, 10);
      }

      // Update the user in the database
      await db.user.update({
         where: { id },
         data: updateData
      });

      // Revalidate the path
      revalidateTag(`/dashboard/user/update`);

      return { success: 'Data sukses di update' };
   } catch (error) {
      console.error(error);
      return { error: 'An unexpected error occurred' };
   }
}
