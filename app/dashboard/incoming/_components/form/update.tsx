'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
   IncomingScale,
   Item,
   Location,
   Supplier,
   SupplierItem
} from '@prisma/client';
import { CalendarIcon, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

import { cn, formatDate } from '@/lib/utils';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
   Popover,
   PopoverContent,
   PopoverTrigger
} from '@/components/ui/popover';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCheckPermissions, useCurrentUser } from '@/hooks/use-user';
import { updateIncomingSchema } from '@/lib/schemas/incoming';

interface UpdateFormProps {
   data: IncomingScale & {
      item?: SupplierItem & {
         supplier?: Supplier;
      };
   };
   products: (SupplierItem & {
      item?: Item;
      supplier?: Supplier;
      location?: Location;
   })[];
}

export function UpdateForm({ data, products }: UpdateFormProps) {
   const user = useCurrentUser();
   const router = useRouter();
   const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>(
      undefined
   );
   const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
      undefined
   );
   const [isPending, setIspending] = useState<boolean>(false);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const updateAccess = useCheckPermissions(user, ['outgoing:update']);

   const form = useForm<z.infer<typeof updateIncomingSchema>>({
      resolver: zodResolver(updateIncomingSchema),
      defaultValues: {
         id: data.id,
         itemId: data.itemId || undefined,
         ticketNo: data.ticketNo,
         driver: data.driver,
         licenseNo: data.licenseNo,
         plateNo: data.plateNo,
         entryTime: data.entryTime,
         exitTime: data.exitTime || undefined,
         weightIn: data.weightIn,
         weightOut: data.weightOut || undefined,
         vehicleType: data.vehicleType || undefined,
         waybillNo: data.waybillNo || undefined,
         oer: data.oer || undefined,
         sorting: data.sorting || undefined,
         origin: data.origin || undefined,
         price: data.price || undefined,
         note: data.note || undefined
      }
   });

   // Grouping suppliers by their locations
   const groupedSuppliers = useMemo(() => {
      const groups = new Map<
         string,
         { location: Location; suppliers: Supplier[] }
      >();

      products.forEach(({ supplier, location }) => {
         if (supplier && location) {
            if (!groups.has(location.id)) {
               groups.set(location.id, { location, suppliers: [] });
            }

            const existingSuppliers = groups.get(location.id)!.suppliers;
            if (!existingSuppliers.some((s) => s.id === supplier.id)) {
               existingSuppliers.push(supplier);
            }
         }
      });

      return Array.from(groups.values());
   }, [products]);

   // Filtering products based on selected supplier and location
   const filteredProducts = useMemo(() => {
      if (!selectedSupplier || !selectedLocation) return [];
      return products.filter(
         (product) =>
            product.supplier?.id === selectedSupplier &&
            product.location?.id === selectedLocation
      );
   }, [products, selectedSupplier, selectedLocation]);

   const selectedItemId = useWatch({ control: form.control, name: 'itemId' });
   const selectedProduct = filteredProducts.find(
      (product) => product.id === selectedItemId
   );

   function onSubmit(values: z.infer<typeof updateIncomingSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
   }

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="space-y-1">
               <span className="text-left text-2xl font-bold">
                  Perbaharui Barang Masuk
               </span>
               <p className="text-sm font-normal text-muted-foreground">
                  {data.item?.supplier?.name}
               </p>
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
                        name="ticketNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Tiket</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Masukkan nomor tiket"
                                    type="text"
                                    disabled={isPending}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Supplier Selection */}
                     <FormItem>
                        <FormLabel>Pemasok</FormLabel>
                        <FormControl>
                           <Select
                              onValueChange={(value) => {
                                 const [supplierId, locationId] =
                                    value.split('-');
                                 setSelectedSupplier(supplierId);
                                 setSelectedLocation(locationId);
                              }} // Update both supplier and location
                              value={
                                 selectedSupplier && selectedLocation
                                    ? `${selectedSupplier}-${selectedLocation}`
                                    : undefined
                              }
                              disabled={isPending}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Pilih Supplier" />
                              </SelectTrigger>
                              <SelectContent>
                                 {groupedSuppliers.length > 0 ? (
                                    groupedSuppliers.map(
                                       ({ location, suppliers }) => (
                                          <SelectGroup key={location.id}>
                                             <SelectLabel>
                                                {location.name}
                                             </SelectLabel>
                                             {suppliers.map((supplier) => (
                                                <SelectItem
                                                   key={`${supplier.id}-${location.id}`}
                                                   value={`${supplier.id}-${location.id}`} // Combining supplier and location
                                                >
                                                   {supplier.name}
                                                </SelectItem>
                                             ))}
                                          </SelectGroup>
                                       )
                                    )
                                 ) : (
                                    <div className="px-4 py-2 text-sm text-muted-foreground">
                                       Tidak ada supplier yang tersedia
                                    </div>
                                 )}
                              </SelectContent>
                           </Select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>

                     {/* Product Selection */}
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
                                    disabled={
                                       isPending ||
                                       !selectedSupplier ||
                                       !selectedLocation
                                    }
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih Produk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {filteredProducts.length > 0 ? (
                                          filteredProducts.map((product) => (
                                             <SelectItem
                                                key={product.id}
                                                value={product.id}
                                             >
                                                {product.item?.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-muted-foreground">
                                             Pilih supplier dan lokasi terlebih
                                             dahulu
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                              <FormDescription className="line-clamp-2">
                                 Pastikan pemasok dan produk sesuai dengan
                                 muatan yang sedang ditimbang
                              </FormDescription>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="driver"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Pengemudi</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan pengemudi"
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
                        name="licenseNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Identitas</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor identitas"
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
                        name="plateNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Kendaraan</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor kendaraan"
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
                        name="entryTime"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel>Waktu Masuk</FormLabel>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <FormControl>
                                       <Button
                                          variant={'outline'}
                                          className={cn(
                                             'bg-inherit pl-3 text-left font-normal',
                                             !field.value &&
                                                'text-muted-foreground'
                                          )}
                                       >
                                          {field.value ? (
                                             formatDate(field.value)
                                          ) : (
                                             <span>Pilih waktu</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                       </Button>
                                    </FormControl>
                                 </PopoverTrigger>
                                 <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                 >
                                    <Calendar
                                       mode="single"
                                       selected={field.value}
                                       onSelect={field.onChange}
                                       disabled={(date) =>
                                          date > new Date() ||
                                          date < new Date('1900-01-01')
                                       }
                                       initialFocus
                                    />
                                 </PopoverContent>
                              </Popover>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="exitTime"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel>Waktu Keluar</FormLabel>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <FormControl>
                                       <Button
                                          variant={'outline'}
                                          className={cn(
                                             'bg-inherit pl-3 text-left font-normal',
                                             !field.value &&
                                                'text-muted-foreground'
                                          )}
                                       >
                                          {field.value ? (
                                             formatDate(field.value)
                                          ) : (
                                             <span>Pilih waktu</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                       </Button>
                                    </FormControl>
                                 </PopoverTrigger>
                                 <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                 >
                                    <Calendar
                                       mode="single"
                                       selected={field.value}
                                       onSelect={field.onChange}
                                       disabled={(date) =>
                                          date > new Date() ||
                                          date < new Date('1900-01-01')
                                       }
                                       initialFocus
                                    />
                                 </PopoverContent>
                              </Popover>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="weightIn"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Neto (Kg) </FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan neto"
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
                        name="weightOut"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Bruto (Kg) </FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan bruto"
                                    disabled={isPending}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name="note"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Catatan</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Masukkan catatan"
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

                  <Button
                     type="submit"
                     disabled={isPending}
                     size={'sm'}
                     className="flex items-center"
                  >
                     <Save />
                     Simpan
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
