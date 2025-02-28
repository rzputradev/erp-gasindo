import { SalesStatus } from '@prisma/client';
import { z } from 'zod';

const orderBaseSchema = z.object({
   quantity: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().min(0, { message: 'Kuantitas tidak boleh kurang dari 0' })
   )
});

export const createOrderSchema = orderBaseSchema.extend({
   contractId: z.string().nonempty({ message: 'Kontrak tidak boleh kosong' })
});

export const updateOrderSchema = orderBaseSchema.extend({
   id: z.string().min(1),
   orderNo: z
      .string()
      .nonempty({ message: 'Nomor pengambilan tidak boleh kosong' }),
   status: z.nativeEnum(SalesStatus),
   remainingQty: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().min(0, { message: 'Sisa kuantitas tidak boleh kurang dari 0' })
   ),
   topUpQty: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z
         .number()
         .min(0, { message: 'Isi ulang kuantitas tidak boleh kurang dari 0' })
   )
});

export const topUpOrderSchema = z.object({
   id: z.string().min(1),
   topUpQty: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().min(0, { message: 'Kuantitas tidak boleh kurang dari 0' })
   )
});
