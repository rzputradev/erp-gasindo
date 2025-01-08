import { UnitType } from '@prisma/client';
import { z } from 'zod';

const itemBaseSchema = z.object({
   name: z.string().nonempty({ message: 'Nama item tidak boleh kosong' }),
   key: z.string().nonempty({ message: 'Key tidak boleh kosong' }),
   unit: z.nativeEnum(UnitType, { message: 'Satuan tidak boleh kosong' }),
   typeId: z.string().optional(),
   description: z.string().optional(),
   isWeighted: z.boolean(),
   isSalable: z.boolean()
});

export const createItemSchema = itemBaseSchema;

export const updateItemSchema = itemBaseSchema.extend({
   id: z.string().min(1)
});
