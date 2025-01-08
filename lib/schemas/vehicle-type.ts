import { z } from 'zod';

const vehicleTypeBaseSchema = z.object({
   name: z.string().nonempty({ message: 'Nama tidak boleh kosong' }),
   description: z.string().optional(),
   loadingCost: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Biaya Muat tidak boleh kurang dari 0' })
         .optional()
   ),
   unloadingCost: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Biaya Bongkar tidak boleh kurang dari 0' })
         .optional()
   )
});

export const createVehicleTypeSchema = vehicleTypeBaseSchema;

export const updateVehicleTypeSchema = vehicleTypeBaseSchema.extend({
   id: z.string().min(1)
});
