import { z } from 'zod';

export const createPermissionSchema = z.object({
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters'
   }),
   key: z.string().min(2, {
      message: 'Key must be at least 2 characters'
   }),
   description: z.string().optional()
});

export const updatePermissionSchema = z.object({
   id: z.string().min(1),
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters'
   }),
   key: z.string().min(2, {
      message: 'Key must be at least 2 characters'
   }),
   description: z.string().optional()
});
