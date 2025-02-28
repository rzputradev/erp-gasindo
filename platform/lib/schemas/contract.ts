import { SalesStatus } from '@prisma/client';
import { z } from 'zod';

const contractBaseSchema = z.object({
   buyerId: z.string().nonempty({ message: 'Pembeli diperlukan' }),
   itemId: z.string().nonempty({ message: 'Item tidak boleh kosong' }),
   locationId: z.string().nonempty({ message: 'Lokasi tidak boleh kosong' }),
   terms: z.string().optional(),
   price: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().min(0, { message: 'Harga tidak boleh kurang dari 0' })
   ),
   vat: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().min(0, { message: 'PPN tidak boleh kurang dari 0' })
   ),
   tolerance: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().min(0, { message: 'Toleransi tidak boleh kurang dari 0' })
   ),
   quantity: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().min(0, { message: 'Kuantitas tidak boleh kurang dari 0' })
   )
});

export const createContractSchema = contractBaseSchema;

export const updateContracSchema = contractBaseSchema.extend({
   id: z.string().min(1),
   contractNo: z
      .string()
      .nonempty({ message: 'Nomor kontrak tidak boleh kosong' }),
   status: z.nativeEnum(SalesStatus),
   updateTolerance: z.boolean().default(false),
   remainingQty: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Sisa kuantitas tidak boleh kurang dari 0' })
         .optional()
   ),
   toleranceWeigh: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Berat toleransi tidak boleh kurang dari 0' })
         .optional()
   ),
   topUpQty: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Isi ulang kuantitas tidak boleh kurang dari 0' })
         .optional()
   )
});

export const topUpContractSchema = z.object({
   id: z.string().min(1),
   topUpQty: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Kuantitas tidak boleh kurang dari 0' })
         .optional()
   )
});
