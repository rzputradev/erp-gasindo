'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { changePasswordSchema } from '@/lib/schemas/setting';
import bcrypt from 'bcryptjs';
import { hash } from 'bcryptjs';

export async function changePassword(
   values: z.infer<typeof changePasswordSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'Pengguna tidak diautentikasi' };

      const { success, data: parsedValues } =
         changePasswordSchema.safeParse(values);
      if (!success) return { error: 'Data tidak valid' };

      const { password, confirm_password, old_password, id } = parsedValues;

      if (password != confirm_password)
         return {
            error: 'Password baru dan konfirmasi password baru tidak sesuai'
         };

      const existingUser = await db.user.findUnique({ where: { id } });
      if (!existingUser || !existingUser.password)
         return { error: 'Pengguna tidak ditemukan' };

      const passwordMatch = await bcrypt.compare(
         old_password,
         existingUser.password
      );
      if (!passwordMatch) return { error: 'Password anda salah' };

      const hashedPassword = await hash(password!, 10);

      await db.$transaction(async (tx) => {
         await tx.user.update({
            where: { id },
            data: {
               password: hashedPassword
            }
         });
      });

      revalidatePath('/dashboard/change-password');

      return { success: 'Data berhasil disimpan' };
   } catch (error) {
      console.error(error);
      return {
         error: 'Terjadi kesalahan tak terduga'
      };
   }
}
