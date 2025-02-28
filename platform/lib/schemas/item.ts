import { UnitType } from '@prisma/client';
import { z } from 'zod';

const itemBaseSchema = z.object({
   name: z.string().nonempty({ message: 'Nama tidak boleh kosong' }),
   key: z.string().nonempty({ message: 'Key tidak boleh kosong' }),
   unit: z.nativeEnum(UnitType, { message: 'Satuan tidak boleh kosong' }),
   categories: z.array(z.string()).optional(),
   description: z.string().optional()
});

export const createItemSchema = itemBaseSchema;

export const updateItemSchema = itemBaseSchema.extend({
   id: z.string().min(1)
});
