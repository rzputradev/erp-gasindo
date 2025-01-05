import { z } from 'zod';

const roleBaseSchema = z.object({
   name: z.string().nonempty({ message: 'Nama tidak boleh kosong' }),
   key: z.string().nonempty({ message: 'Key tidak boleh kosong' }),
   description: z.string().optional(),
   permissions: z.array(z.string()).optional()
});

export const createRoleSchema = roleBaseSchema;

export const updateRoleSchema = roleBaseSchema.extend({
   id: z.string().min(1)
});
