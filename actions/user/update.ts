'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { updateUserSchema } from '@/lib/schemas/user';
import { revalidatePath } from 'next/cache';
import { saveImage } from '@/lib/file-uploader';

export async function updateUser(values: z.infer<typeof updateUserSchema>) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         updateUserSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields', details: parsedValues };

      const { id, name, email, gender, password, locationId, roleId, image } =
         parsedValues;

      // Check if the email already exists (except for the current user)
      const existingEmail = await db.user.findUnique({ where: { email } });
      if (existingEmail && existingEmail.id !== id) {
         return { error: 'Email already exists' };
      }

      // Handle image upload or URL preservation
      let imageUrl = existingEmail?.image;
      if (image) {
         try {
            imageUrl = await saveImage(image);
         } catch (error) {
            return { error: 'Image upload failed' };
         }
      }

      // Prepare update data
      const updateData: Record<string, unknown> = {
         locationId: locationId || undefined,
         roleId: roleId || undefined,
         name,
         email,
         gender,
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
      revalidatePath(`/dashboard/user`);

      return { success: 'User updated successfully' };
   } catch (error) {
      console.error(error);
      return { error: 'An unexpected error occurred' };
   }
}
