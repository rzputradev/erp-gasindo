import { IncomingScaleType } from '@prisma/client';
import { z } from 'zod';

export const incomingEntrySchema = z.object({
   locationId: z.string().min(1, {
      message: 'Weigthing location is required.'
   }),
   supplierId: z.string().min(1, {
      message: 'Supplier is required'
   }),
   itemId: z.string().min(1, {
      message: 'Item is required'
   }),
   type: z.enum(
      [
         IncomingScaleType.WEIGH,
         IncomingScaleType.REWEIGH,
         IncomingScaleType.OTHERS
      ],
      {
         required_error: 'Select type scale'
      }
   ),
   driver: z.string().min(1, {
      message: 'Driver name is required'
   }),
   vehicleTypeId: z.string().optional(),
   plateNo: z.string().min(1, {
      message: 'Licence plate is required'
   }),
   licenseNo: z.string().min(1, {
      message: 'Driving licence is required'
   }),
   origin: z.string().min(1, {
      message: 'Origin is required'
   }),
   weight: z.number().min(1, {
      message: 'Weight is required'
   })
});

export const incomingExitSchema = z.object({
   weight: z.number().min(1, { message: 'Weight is required.' }),
   id: z.string().min(1, { message: 'Mill origin is required.' }),
   locationId: z.string().min(1, {
      message: 'Weigthing location is required.'
   }),
   sorting: z.string().optional(),
   oer: z.string().optional(),
   waybillNo: z.string().optional(),
   note: z.string().optional()
});

// Outgoing
export const outgoingEntrySchema = z.object({
   weight: z.number().min(1, {
      message: 'Weight is required'
   }),
   locationId: z.string().min(1, {
      message: 'Weigthing location is required.'
   }),
   orderId: z.string().min(1, {
      message: 'Item is required'
   }),
   driver: z.string().min(1, {
      message: 'Driver name is required'
   }),
   transporterId: z.string().min(1, {
      message: 'Transporter is required'
   }),
   plateNo: z.string().min(1, {
      message: 'Licence plate is required'
   }),
   licenseNo: z.string().min(1, {
      message: 'Driving licence is required'
   })
});

export const outgoingExitSchema = z.object({
   id: z.string().min(1, { message: 'Mill origin is required.' }),
   weight: z.number().min(1, { message: 'Weight is required.' }),
   locationId: z.string().min(1, {
      message: 'Weigthing location is required.'
   }),
   splitOrderNo: z.string().optional(),
   sealStartNo: z.string().optional(),
   sealEndNo: z.string().optional(),
   poNo: z.string().optional(),
   sto: z.string().optional(),
   so: z.string().optional(),
   ffa: z.string().optional(),
   moist: z.string().optional(),
   broken: z.string().optional(),
   dirty: z.string().optional(),
   fiber: z.string().optional(),
   note: z.string().optional()
});
