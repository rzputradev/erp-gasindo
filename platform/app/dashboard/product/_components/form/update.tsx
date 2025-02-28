'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
   Item,
   Location,
   Supplier,
   SupplierItem,
   SupplierItemType
} from '@prisma/client';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import * as z from 'zod';

import { updateProductSchema } from '@/lib/schemas/product';
import { updateProduct } from '@/actions/product/update';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';

interface UpdateFormProps {
   data: SupplierItem;
   locations: Location[];
   suppliers: Supplier[];
   items: Item[];
}

export function UpdateForm({
   data,
   locations,
   suppliers,
   items
}: UpdateFormProps) {
   const router = useRouter();
   const [isUpdatePrice, setIsUpdatePrice] = useState<boolean>(false);
   const [isPending, setIspending] = useState<boolean>(false);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof updateProductSchema>>({
      resolver: zodResolver(updateProductSchema),
      defaultValues: {
         id: data.id,
         locationId: data.locationId || '',
         supplierId: data.supplierId || '',
         itemId: data.itemId || '',
         type: data.type,
         price: data.price || 0
      }
   });

   function onSubmit(values: z.infer<typeof updateProductSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         updateProduct(values)
            .then((res) => {
               setIspending(false);
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
                  form.reset();
               }
               if (res?.success) {
                  setSuccess(res.success);
                  toast.success(res.success);
                  router.push(`/dashboard/product/read?id=${data.id}`);
               }
            })
            .catch((e) => {
               console.log(e);
               form.reset();
               setIspending(false);
               toast.error('Terjadi kesalahan tak terduga');
            });
      });
   }

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Perbaharui Produk
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <FormField
                        control={form.control}
                        name="locationId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Pabrik</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih pabrik" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {locations.length > 0 ? (
                                          locations.map((location) => (
                                             <SelectItem
                                                key={location.id}
                                                value={location.id}
                                             >
                                                {location.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada pabrik yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Pemasok</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih pemasok" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {suppliers.length > 0 ? (
                                          suppliers.map((supplier) => (
                                             <SelectItem
                                                key={supplier.id}
                                                value={supplier.id}
                                             >
                                                {supplier.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada pemasok yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="itemId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Produk</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih produk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {items.length > 0 ? (
                                          items.map((product) => (
                                             <SelectItem
                                                key={product.id}
                                                value={product.id}
                                             >
                                                {product.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada produk yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Tipe produk</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                                 disabled={isPending}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih tipe produk" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={SupplierItemType.WEIGH}>
                                       Buah
                                    </SelectItem>
                                    <SelectItem
                                       value={SupplierItemType.REWEIGH}
                                    >
                                       Buah Ulangan
                                    </SelectItem>
                                    <SelectItem value={SupplierItemType.OTHERS}>
                                       Lainnya
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {form.watch('type') !== 'OTHERS' && (
                        <FormField
                           control={form.control}
                           name="price"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Referensi Harga (Rp)</FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       placeholder="Masukkan referensi harga"
                                       disabled={isPending || !isUpdatePrice}
                                       {...field}
                                    />
                                 </FormControl>
                                 <div className="flex items-center gap-2">
                                    <Checkbox
                                       id="price"
                                       checked={isUpdatePrice}
                                       onCheckedChange={(checked) => {
                                          setIsUpdatePrice(!!checked);
                                       }}
                                       disabled={isPending}
                                    />
                                    <label
                                       htmlFor="price"
                                       className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                       Perbaharui refensi harga
                                    </label>
                                 </div>
                                 {isUpdatePrice && (
                                    <FormDescription>
                                       Mengubah referensi harga akan secara
                                       langsung mengubah harga pada timbangan.
                                    </FormDescription>
                                 )}
                              </FormItem>
                           )}
                        />
                     )}
                  </div>

                  <FormSuccess message={success} />
                  <FormError message={error} />

                  <Button type="submit" size={'sm'} disabled={isPending}>
                     Submit
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
