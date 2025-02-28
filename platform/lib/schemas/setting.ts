import { Gender } from '@prisma/client';
import { z } from 'zod';

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
   'image/jpeg',
   'image/jpg',
   'image/png',
   'image/webp'
];

export const updatePersonalSchema = z.object({
   id: z.string().nonempty({ message: 'Id user diperlukan' }),
   name: z.string().nonempty({ message: 'Nama tidak boleh kosong' }),
   gender: z.nativeEnum(Gender),
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
         'Hanya .jpg, .jpeg, .png, and .webp yang diterima'
      )
});

export const changePasswordSchema = z
   .object({
      id: z.string().nonempty({ message: 'Id user diperlukan' }),
      old_password: z
         .string()
         .nonempty({ message: 'Password tidak boleh kosong' }),
      password: z
         .string()
         .min(6, {
            message: 'Password baru harus memiliki minimal 6 karakter'
         }),
      confirm_password: z
         .string()
         .nonempty({ message: 'Konfirmasi password tidak boleh kosong' })
   })
   .refine((data) => data.password === data.confirm_password, {
      message: 'Password dan konfirmasi password tidak sama',
      path: ['confirm_password']
   });
