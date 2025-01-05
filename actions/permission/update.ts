'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { updateLocationSchema } from '@/lib/schemas/location';
import { revalidatePath, revalidateTag } from 'next/cache';
import { updatePermissionSchema } from '@/lib/schemas/permission';

export async function updatePermission(
   values: z.infer<typeof updatePermissionSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         updatePermissionSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { id, name, key, description } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.permission.update({
            where: { id },
            data: { name, key, description }
         });
      });

      revalidateTag(`/dashboard/permission/update?id=${id}`);

      return { success: 'Data updated successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
