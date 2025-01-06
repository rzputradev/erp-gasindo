import { z } from 'zod';

const buyerBaseSchema = z.object({
   name: z.string().nonempty({ message: 'Nama tidak boleh kosong' }),
   key: z.string().nonempty({ message: 'Key tidak boleh kosong' }),
   tin: z.string().nonempty({ message: 'Surat izin tidak boleh kosong' }),
   address: z.string().nonempty({ message: 'Alamat tidak boleh kosong' }),
   phone: z.string().nonempty({ message: 'No telepon tidak boleh kosong' })
});

export const createBuyerSchema = buyerBaseSchema;

export const updateBuyerSchema = buyerBaseSchema.extend({
   id: z.string().min(1)
});
