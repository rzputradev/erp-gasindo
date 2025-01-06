'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
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

      revalidatePath(`/dashboard/permission/update`);

      return { success: 'Data updated successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
