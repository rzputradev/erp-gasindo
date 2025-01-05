'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { createUserSchema } from '@/lib/schemas/user';
import { revalidatePath } from 'next/cache';
import { saveImage } from '@/lib/file-uploader';
// import { saveImage } from "@/lib/image-uploader"; // Import saveImage utility

export async function createUser(values: z.infer<typeof createUserSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         createUserSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields', details: parsedValues };

      const {
         name,
         email,
         gender,
         password,
         confirm_password,
         locationId,
         roleId,
         image
      } = parsedValues;

      const existingEmail = await db.user.findUnique({ where: { email } });

      if (existingEmail) return { error: 'Email already exist' };

      if (password !== confirm_password) {
         return { error: 'Passwords do not match' };
      }

      const hashedPassword = await hash(password!, 10);

      let imageUrl = null;
      if (image) {
         try {
            imageUrl =
               typeof image === 'string' ? image : await saveImage(image); // Process if not already a URL
         } catch (error) {
            return { error: 'Image upload failed' };
         }
      }

      await db.user.create({
         data: {
            locationId: locationId || undefined,
            roleId: roleId || undefined,
            name,
            email,
            gender,
            password: hashedPassword,
            image: imageUrl
         }
      });

      revalidatePath(`/dashboard/user`);

      return { success: 'User created successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
