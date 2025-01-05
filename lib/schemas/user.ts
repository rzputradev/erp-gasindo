import { Gender } from '@prisma/client';
import { z } from 'zod';

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
   'image/jpeg',
   'image/jpg',
   'image/png',
   'image/webp'
];

const userBaseSchema = z.object({
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters'
   }),
   email: z.string().email({
      message: 'Please enter a valid email address'
   }),
   password: z.string().min(6, { message: 'Password is too short' }).optional(),
   confirm_password: z
      .string()
      .min(6, { message: 'Confirm password is required' })
      .optional(),
   gender: z.enum([Gender.MALE, Gender.FEMALE], {
      message: 'Please select gender'
   }),
   locationId: z.string().optional(),
   roleId: z.string().optional(),
   image: z
      .any()
      .optional()
      .refine(
         (files) =>
            !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
         'Max file size is 1MB.'
      )
      .refine(
         (files) =>
            !files ||
            files.length === 0 ||
            ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
         '.jpg, .jpeg, .png, and .webp files are accepted.'
      )
});

export const createUserSchema = userBaseSchema.refine(
   (data) => data.password === data.confirm_password,
   {
      message: 'Password and confirm password do not match!',
      path: ['confirm_password']
   }
);

export const updateUserSchema = userBaseSchema
   .extend({
      id: z.string().min(1, { message: 'User ID is required for updating' })
   })
   .refine(
      (data) => {
         // Only validate password match if both fields are provided
         if (data.password && data.confirm_password) {
            return data.password === data.confirm_password;
         }
         return true; // Skip validation if one or both fields are missing
      },
      {
         message: 'Password and confirm password do not match!',
         path: ['confirm_password']
      }
   );
