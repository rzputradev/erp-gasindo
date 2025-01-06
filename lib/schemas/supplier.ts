import { z } from 'zod';

const buyerBaseSchema = z.object({
   name: z.string().nonempty({ message: 'Nama tidak boleh kosong' }),
   key: z.string().nonempty({ message: 'Key tidak boleh kosong' }),
   address: z.string().optional(),
   phone: z.string().nonempty({ message: 'No telepon tidak boleh kosong' })
});

export const createSupplierSchema = buyerBaseSchema;

export const updateSupplierSchema = buyerBaseSchema.extend({
   id: z.string().min(1)
});
