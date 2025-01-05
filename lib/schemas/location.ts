import { LocationType } from '@prisma/client';
import { z } from 'zod';

export const createLocationSchema = z.object({
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters'
   }),
   key: z.string().min(2, {
      message: 'Key must be at least 2 characters'
   }),
   type: z.nativeEnum(LocationType, { message: 'Please select type' }),
   address: z.string().min(2, {
      message: 'Address must be at least 2 characters'
   })
});

export const updateLocationSchema = z.object({
   id: z.string().min(1),
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters'
   }),
   key: z.string().min(2, {
      message: 'Key must be at least 2 characters'
   }),
   type: z.nativeEnum(LocationType, { message: 'Please select type' }),
   address: z.string().min(2, {
      message: 'Address must be at least 2 characters'
   })
});
