import { Gender } from "@prisma/client";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
   'image/jpeg',
   'image/jpg',
   'image/png',
   'image/webp'
];

export const addUserSchema = z.object({
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters'
   }),
   email: z.string().email({
      message: 'Please enter a valid email address'
   }),
   password: z.string().min(6, { message: "Password is too short" }),
   confirm_password: z.string().min(1, { message: "Confirm password id required" }),
   gender: z.enum([Gender.MALE, Gender.FEMALE], { message: "Please select gender" }),
   roleId: z.string().optional(),
   image: z
      .any()
      .optional()
      .refine(
         (files) => !files || files.length === 1,
         'Only one image is allowed.'
      )
      .refine(
         (files) => !files || files[0]?.size <= MAX_FILE_SIZE,
         `Max file size is 5MB.`
      )
      .refine(
         (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
         '.jpg, .jpeg, .png, and .webp files are accepted.'
      ),
});
