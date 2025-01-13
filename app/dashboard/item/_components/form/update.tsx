'use client';

import * as z from 'zod';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, startTransition } from 'react';
import { Item, ItemType, UnitType } from '@prisma/client';
import { FormError } from '@/components/form-error';

import { updateItem } from '@/actions/item/update';
import { updateItemSchema } from '@/lib/schemas/item';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormSuccess } from '@/components/form-success';
import { Checkbox } from '@/components/ui/checkbox';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';

interface UpdateFormProps {
   data: Item;
   itemTypes: ItemType[];
}

export function UpdateForm({ data, itemTypes }: UpdateFormProps) {
   const [isPending, setIspending] = useState<boolean>(false);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof updateItemSchema>>({
      resolver: zodResolver(updateItemSchema),
      defaultValues: {
         id: data.id,
         name: data.name,
         key: data.key,
         description: data.description || '',
         unit: data.unit,
         typeId: data.typeId || undefined,
         isWeighted: data.isWeighted,
         isSalable: data.isSalable
      }
   });

   function onSubmit(values: z.infer<typeof updateItemSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         updateItem(values)
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
                              <FormLabel>Key</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan key"
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
                        name="typeId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Tipe Item</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih tipe item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem key="none" value="none">
                                          Tidak ada
                                       </SelectItem>
                                       {itemTypes.length > 0 ? (
                                          itemTypes.map((itemType) => (
                                             <SelectItem
                                                key={itemType.id}
                                                value={itemType.id}
                                             >
                                                {itemType.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada tipe item yang tersedia
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
                        name="isWeighted"
                        render={({ field }) => (
                           <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-md border p-4 shadow-sm">
                              <FormControl>
                                 <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isPending}
                                 />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                 <FormLabel>
                                    Apakah item melewati timbangan?
                                 </FormLabel>
                                 <FormDescription>
                                    Pilih opsi ini jika item harus ditimbang
                                    sebelum diproses atau dijual.
                                 </FormDescription>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="isSalable"
                        render={({ field }) => (
                           <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                              <FormControl>
                                 <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isPending}
                                 />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                 <FormLabel>
                                    Apakah item dapat dijual?
                                 </FormLabel>
                                 <FormDescription>
                                    Pilih opsi ini jika item tersedia untuk
                                    dijual kepada pembeli.
                                 </FormDescription>
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
