'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ItemCategory, UnitType } from '@prisma/client';

import { createItem } from '@/actions/item/create';

import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { createItemSchema } from '@/lib/schemas/item';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreateFormProps {
   itemCategories: ItemCategory[];
}

export function CreateForm({ itemCategories }: CreateFormProps) {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const form = useForm<z.infer<typeof createItemSchema>>({
      resolver: zodResolver(createItemSchema),
      defaultValues: {
         name: '',
         key: '',
         unit: UnitType.KG,
         description: '',
         categories: []
      }
   });

   function onSubmit(values: z.infer<typeof createItemSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         createItem(values)
            .then((res) => {
               setIspending(false);
               form.reset();
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
               }
               if (res?.success) {
                  setSuccess(res.success);
                  toast.success(res.success);
                  router.push('/dashboard/item');
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
               Tambah Barang
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
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nama</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Masukkan nama item"
                                    type="text"
                                    disabled={isPending}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Kode</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan kode"
                                    disabled={isPending}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Satuan</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                                 disabled={isPending}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Satuan item" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={UnitType.KG}>
                                       Kilogram
                                    </SelectItem>
                                    <SelectItem value={UnitType.LTR}>
                                       Liter
                                    </SelectItem>
                                    <SelectItem value={UnitType.PCS}>
                                       Keping
                                    </SelectItem>
                                    <SelectItem value={UnitType.TON}>
                                       Ton
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Kategori</FormLabel>
                              <FormControl>
                                 <Select
                                    value={
                                       Array.isArray(field.value)
                                          ? field.value[0]
                                          : field.value || ''
                                    } // Ensure value is an array
                                    onValueChange={(value) => {
                                       const selectedValues = field.value || [];
                                       if (selectedValues.includes(value)) {
                                          // Remove if already selected
                                          field.onChange(
                                             selectedValues.filter(
                                                (v) => v !== value
                                             )
                                          );
                                       } else {
                                          // Add new value
                                          field.onChange([
                                             ...selectedValues,
                                             value
                                          ]);
                                       }
                                    }}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {itemCategories.length > 0 ? (
                                          itemCategories.map((itemCategory) => (
                                             <SelectItem
                                                key={itemCategory.id}
                                                value={itemCategory.id}
                                             >
                                                {itemCategory.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada kategori yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>

                              <div className="mt-2 flex flex-wrap gap-2">
                                 {field.value?.map((id) => {
                                    const category = itemCategories.find(
                                       (cat) => cat.id === id
                                    );
                                    return (
                                       <Badge
                                          variant={'secondary'}
                                          key={id}
                                          className="flex items-center space-x-2 text-sm font-normal"
                                       >
                                          <span>{category?.name}</span>
                                          <X
                                             className="size-3 text-red-500 hover:text-red-700"
                                             onClick={() => {
                                                field.onChange(
                                                   field.value?.filter(
                                                      (v) => v !== id
                                                   )
                                                );
                                             }}
                                          />
                                       </Badge>
                                    );
                                 })}
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem className="col-span-2">
                           <FormLabel>Deskripsi</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Tulis deskipsi"
                                 className="resize-none"
                                 disabled={isPending}
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormSuccess message={success} />
                  <FormError message={error} />

                  <Button type="submit" disabled={isPending}>
                     Submit
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
