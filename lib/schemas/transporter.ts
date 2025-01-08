import { z } from 'zod';

const transporterBaseSchema = z.object({
   name: z.string().nonempty({ message: 'Nama tidak boleh kosong' }),
   locationId: z.string().nonempty({ message: 'Lokasi tidak boleh kosong' }),
   key: z.string().nonempty({ message: 'Key tidak boleh kosong' }),
   address: z.string().optional(),
   phone: z.string().optional()
});

export const createTransporterSchema = transporterBaseSchema;

export const updateTransporterSchema = transporterBaseSchema.extend({
   id: z.string().min(1)
});
