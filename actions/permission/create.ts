'use server';

import { z } from 'zod';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { createPermissionSchema } from '@/lib/schemas/permission';

export async function createPersmission(
   values: z.infer<typeof createPermissionSchema>
) {
   try {
      const user = await currentUser();
      if (!user) return { error: 'User is not authenticated' };

      const { success, data: parsedValues } =
         createPermissionSchema.safeParse(values);
      if (!success) return { error: 'Invalid fields' };

      const { name, key, description } = parsedValues;

      await db.$transaction(async (tx) => {
         await tx.permission.create({
            data: {
               name,
               key,
               description
            }
         });
      });

      return { success: 'Data saved successfully' };
   } catch (error) {
      console.error(error);
      return {
         error: 'An unexpected error occurred'
      };
   }
}
