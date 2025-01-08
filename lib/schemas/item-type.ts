import { z } from 'zod';

const itemTypeBaseSchema = z.object({
   name: z.string().nonempty({ message: 'Nama tidak boleh kosong' }),
   key: z.string().nonempty({ message: 'Key tidak boleh kosong' }),
   description: z.string().optional()
   // isWeighted: z.boolean(),
   // isSalable: z.boolean()
});

export const createItemTypeSchema = itemTypeBaseSchema;

export const updateItemTypeSchema = itemTypeBaseSchema.extend({
   id: z.string().min(1)
});
