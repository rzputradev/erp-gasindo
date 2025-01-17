'use client';

import * as React from 'react';
import { useState, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Item, ItemCategory, UnitType } from '@prisma/client';

import { updateItem } from '@/actions/item/update';
import { updateItemSchema } from '@/lib/schemas/item';

import { Button } from '@/components/ui/button';
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

interface UpdateFormProps {
   data: Item & { categories?: ItemCategory[] };
   itemCategories: ItemCategory[];
}

export function UpdateForm({ data, itemCategories }: UpdateFormProps) {
   const [isPending, setIsPending] = useState(false);
   const [success, setSuccess] = useState<string | undefined>();
   const [error, setError] = useState<string | undefined>();

   const form = useForm<z.infer<typeof updateItemSchema>>({
      resolver: zodResolver(updateItemSchema),
      defaultValues: {
         id: data.id,
         name: data.name,
         key: data.key,
         description: data.description || '',
         unit: data.unit,
         categories: data.categories?.map((cat) => cat.id) || []
      }
   });

   const onSubmit = (values: z.infer<typeof updateItemSchema>) => {
      setIsPending(true);
      setError(undefined);
      setSuccess(undefined);

      startTransition(() => {
         updateItem(values)
            .then((res) => {
               setIsPending(false);
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
               }
               if (res?.success) {
                  setSuccess(res.success);
                  toast.success(res.success);
               }
            })
            .catch(() => {
               setIsPending(false);
               setError('Terjadi kesalahan tak terduga');
               toast.error('Terjadi kesalahan tak terduga');
            });
      });
   };

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Perbaharui Item
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     {/* Name Field */}
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nama</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Masukkan nama item"
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
                                 value={field.value}
                                 disabled={isPending}
                              >
                                 <SelectTrigger>
                                    <SelectValue placeholder="Pilih satuan" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {Object.values(UnitType).map((unit) => (
                                       <SelectItem key={unit} value={unit}>
                                          {unit}
                                       </SelectItem>
                                    ))}
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
                                    onValueChange={(value) => {
                                       const selectedValues = field.value || [];
                                       if (selectedValues.includes(value)) {
                                          // Remove the category if already selected
                                          field.onChange(
                                             selectedValues.filter(
                                                (v) => v !== value
                                             )
                                          );
                                       } else {
                                          // Add the category if not selected
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
                                          itemCategories.map((category) => (
                                             <SelectItem
                                                key={category.id}
                                                value={category.id}
                                             >
                                                {category.name}
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
                                          key={id}
                                          variant="secondary"
                                          className="flex items-center space-x-2 text-sm font-normal"
                                       >
                                          <span>{category?.name}</span>
                                          <X
                                             className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                                             onClick={() =>
                                                field.onChange(
                                                   field.value?.filter(
                                                      (v) => v !== id
                                                   )
                                                )
                                             }
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
                        <FormItem>
                           <FormLabel>Deskripsi</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Tulis deskripsi"
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
