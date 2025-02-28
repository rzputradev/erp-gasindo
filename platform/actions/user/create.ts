'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';
import { createUserSchema } from '@/lib/schemas/user';
import { saveImage } from '@/lib/file-uploader';

export async function createUser(values: z.infer<typeof createUserSchema>) {
   try {
      const user = await currentUser();
      const access = await checkPermissions(user, ['user:create']);
      if (!access) return { error: 'Anda tidak memiliki akses' };

      const { success, data: parsedValues } =
         createUserSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const {
         name,
         email,
         gender,
         password,
         confirm_password,
         locationId,
         roleId,
         image,
         status
      } = parsedValues;

      const existingEmail = await db.user.findUnique({ where: { email } });

      if (existingEmail) return { error: 'Email sudah ada' };

      if (!password || password !== confirm_password) {
         return { error: 'Password tidak cocok' };
      }

      const hashedPassword = await hash(password, 10);

      let imageUrl = null;
      if (image) {
         try {
            imageUrl =
               typeof image === 'string' ? image : await saveImage(image);
         } catch (error) {
            return { error: 'Pengunggahan gambar gagal' };
         }
      }

      await db.user.create({
         data: {
            locationId: locationId || undefined,
            roleId: roleId || undefined,
            name,
            email,
            gender,
            status,
            password: hashedPassword,
            image: imageUrl,
            emailVerified: new Date()
         }
      });

      revalidatePath(`/dashboard/user`);

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
