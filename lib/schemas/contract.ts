import { ContractStatus } from '@prisma/client';
import { z } from 'zod';

const contractBaseSchema = z.object({
   buyerId: z.string().nonempty({ message: 'Pembeli diperlukan' }),
   itemId: z.string().nonempty({ message: 'Item tidak boleh kosong' }),
   locationId: z.string().nonempty({ message: 'Lokasi tidak boleh kosong' }),
   status: z.nativeEnum(ContractStatus),
   terms: z.string().optional(),
   tolerance: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Toleransi tidak boleh kurang dari 0' })
         .optional()
   ),
   totalQty: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Kuantitas tidak boleh kurang dari 0' })
         .optional()
   ),
   vat: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().min(0, { message: 'PPN tidak boleh kurang dari 0' }).optional()
   ),
   price: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Harga tidak boleh kurang dari 0' })
         .optional()
   )
});

export const createContractSchema = contractBaseSchema;

export const updateContracSchema = contractBaseSchema.extend({
   id: z.string().min(1),
   toleranceWeigh: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Biaya Bongkar tidak boleh kurang dari 0' })
         .optional()
   )
});
