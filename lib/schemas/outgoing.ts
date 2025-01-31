import { Transporter } from '@prisma/client';
import { z } from 'zod';

// Base schema for shared fields
const outgoingBaseSchema = z.object({
   driver: z.string().nonempty({ message: 'Pengemudi tidak boleh kosong' }),
   plateNo: z.string().nonempty({ message: 'Nomor polisi tidak boleh kosong' }),
   licenseNo: z
      .string()
      .nonempty({ message: 'No Identitas tidak boleh kosong' }),
   transporter: z.nativeEnum(Transporter, {
      message: 'Penyedia angkutan tidak boleh kosong'
   }),
   weightIn: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().min(1, { message: 'Tara tidak boleh kurang dari 0' })
   )
});

export const createOutgoingSchema = outgoingBaseSchema.extend({
   orderId: z
      .string()
      .nonempty({ message: 'Nomor surat pengambilan diperlukan' })
});

export const exitOutgoingSchema = z.object({
   id: z.string().nonempty({ message: 'Id tidak boleh kosong' }),
   weightOut: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().min(0, { message: 'Bruto tidak boleh kurang dari 0' })
   ),
   splitOrderNo: z.string().optional(),
   seal: z.string().optional(),
   sto: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   so: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   ffa: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   moist: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   broken: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   dirty: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   fiber: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   note: z.string().optional()
});

export const updateOutgoingSchema = exitOutgoingSchema
   .merge(outgoingBaseSchema)
   .extend({
      entryTime: z.date().optional(),
      exitTime: z.date().optional(),
      ticketNo: z
         .string()
         .nonempty({ message: 'Nomor tiket tidak boleh kosong' })
   });

export const transferOutogingSchema = z.object({
   id: z.string(),
   orderId: z
      .string()
      .nonempty({ message: 'Nomor surat pengambilan tidak boleh kosong' }),
   quantity: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().min(1, {
         message: 'Kuantitas yang ingin dipindahkan tidak boleh kosong'
      })
   )
});
