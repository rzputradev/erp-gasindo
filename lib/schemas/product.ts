import { SupplierItemType } from '@prisma/client';
import { z } from 'zod';

const productBaseSchema = z.object({
   locationId: z.string().nonempty({ message: 'Pebrik tidak boleh kosong' }),
   supplierId: z.string().nonempty({ message: 'Pemasok tidak boleh kosong' }),
   itemId: z.string().nonempty({ message: 'Produk tidak boleh kosong' }),
   price: z.preprocess(
      (val) => (val !== '' ? Number(val) : 0),
      z.number().optional()
   ),
   type: z.nativeEnum(SupplierItemType, {
      message: 'Jenis produk tidak boleh kosong'
   })
});

export const createProductSchema = productBaseSchema;

export const updateProductSchema = productBaseSchema.extend({
   id: z.string().min(1)
});
