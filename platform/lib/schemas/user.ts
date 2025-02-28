import { Gender, UserStatus } from '@prisma/client';
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
      message: 'Nama tidak boleh kosong'
   }),
   email: z.string().email({
      message: 'Email tidak valid atau kosong'
   }),
   status: z.nativeEnum(UserStatus),
   password: z
      .string()
      .min(6, { message: 'Password terlalu pendek' })
      .optional(),
   confirm_password: z
      .string()
      .min(6, { message: 'Konfirmasi password diperlukan' })
      .optional(),
   gender: z.nativeEnum(Gender, {
      message: 'Pilih jenis kelamin'
   }),
   locationId: z.string().optional(),
   roleId: z.string().optional(),
   image: z
      .any()
      .optional()
      .refine(
         (files) =>
            !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
         'File maximal 1MB'
      )
      .refine(
         (files) =>
            !files ||
            files.length === 0 ||
            ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
         'Hanya .jpg, .jpeg, .png, and .webp'
      )
});

export const createUserSchema = userBaseSchema.refine(
   (data) => data.password === data.confirm_password,
   {
      message: 'Password dan konfirmasi password tidak sama',
      path: ['confirm_password']
   }
);

export const updateUserSchema = userBaseSchema
   .extend({
      id: z.string().min(1, { message: 'User id tidak ada' })
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
         message: 'Password dan konfirmasi password tidak sama',
         path: ['confirm_password']
      }
   );
