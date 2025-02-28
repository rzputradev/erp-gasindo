import { Transporter, VehicleType } from '@prisma/client';
import { z } from 'zod';

// Base schema for shared fields
const incomingBaseSchema = z.object({
   driver: z.string().nonempty({ message: 'Pengemudi tidak boleh kosong' }),
   plateNo: z.string().nonempty({ message: 'Nomor polisi tidak boleh kosong' }),
   itemId: z.string().nonempty({ message: 'Produk tidak boleh kosong' }),
   licenseNo: z
      .string()
      .nonempty({ message: 'No Identitas tidak boleh kosong' }),
   weightIn: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().min(1, { message: 'Bruto tidak boleh kurang dari 0' })
   ),
   vehicleType: z.nativeEnum(VehicleType).optional(),
   waybillNo: z.string().optional(),
   origin: z.string().optional()
});

export const createIncomingSchema = incomingBaseSchema;

export const exitIncomingSchema = z.object({
   id: z.string().nonempty({ message: 'Id tidak boleh kosong' }),
   weightOut: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().min(0, { message: 'Bruto tidak boleh kurang dari 0' })
   ),
   sorting: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   oer: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   waybillNo: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number().optional()
   ),
   note: z.string().optional()
});

export const updateIncomingSchema = exitIncomingSchema
   .merge(incomingBaseSchema)
   .extend({
      entryTime: z.date().optional(),
      exitTime: z.date().optional(),
      ticketNo: z
         .string()
         .nonempty({ message: 'Nomor tiket tidak boleh kosong' }),
      price: z.preprocess(
         (val) => (val !== '' ? Number(val) : undefined),
         z.number().optional()
      )
   });
