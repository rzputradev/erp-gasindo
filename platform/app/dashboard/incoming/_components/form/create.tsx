'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, startTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { formatNumber } from '@/lib/utils';
import { createIncoming } from '@/actions/incoming/create';
import {
   Item,
   Location,
   Order,
   Supplier,
   SupplierItem,
   SupplierItemType,
   Transporter,
   VehicleType
} from '@prisma/client';

import { ManualWeight } from '@/components/manual-weight';
import { AutoWeight } from '@/components/auto-weight';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Save } from 'lucide-react';
import { createIncomingSchema } from '@/lib/schemas/incoming';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';

interface CreateFormProps {
   products: (SupplierItem & {
      item?: Item;
      supplier?: Supplier;
      location?: Location;
   })[];
   manualInput: boolean;
}

export function CreateForm({ products, manualInput }: CreateFormProps) {
   const router = useRouter();
   const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>(
      undefined
   );
   const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
      undefined
   );
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const form = useForm<z.infer<typeof createIncomingSchema>>({
      resolver: zodResolver(createIncomingSchema),
      defaultValues: {
         weightIn: 0,
         itemId: '',
         driver: '',
         licenseNo: '',
         plateNo: '',
         origin: '',
         waybillNo: ''
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

   function onSubmit(values: z.infer<typeof createIncomingSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         createIncoming(values)
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
                  router.push('/dashboard/incoming');
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
      <Card className="mx-auto w-full">
         <CardHeader>
            <CardTitle className="flex flex-col gap-1">
               <span className="text-left text-2xl font-bold">
                  Barang Masuk
               </span>
               <p className="font-normal text-muted-foreground">
                  Timbang Bruto
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
                     {manualInput ? (
                        <ManualWeight
                           form={form}
                           isPending={isPending}
                           weightField="weightIn"
                        />
                     ) : (
                        <AutoWeight form={form} weightField="weightIn" />
                     )}

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

                     {selectedProduct?.type &&
                        selectedProduct.type !== SupplierItemType.OTHERS && (
                           <FormField
                              control={form.control}
                              name="origin"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Asal Buah</FormLabel>
                                    <FormControl>
                                       <Input
                                          type="text"
                                          placeholder="Masukkan asal buah"
                                          disabled={isPending}
                                          {...field}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        )}

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

                     {selectedProduct?.type &&
                        selectedProduct.type !== SupplierItemType.OTHERS && (
                           <FormField
                              control={form.control}
                              name="vehicleType"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Jenis Kendaraan</FormLabel>
                                    <Select
                                       onValueChange={field.onChange}
                                       defaultValue={field.value}
                                       disabled={isPending}
                                    >
                                       <FormControl>
                                          <SelectTrigger>
                                             <SelectValue placeholder="Pilih jenis kendaraan" />
                                          </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                          <SelectItem
                                             value={VehicleType.COLD_DEASEL}
                                          >
                                             Cold Deasel
                                          </SelectItem>
                                          <SelectItem
                                             value={VehicleType.COLD_DEASEL_ND}
                                          >
                                             Cold Deasel Non Dump
                                          </SelectItem>
                                          <SelectItem
                                             value={VehicleType.TRONTON}
                                          >
                                             Tronton
                                          </SelectItem>
                                          <SelectItem
                                             value={VehicleType.PICKUP}
                                          >
                                             Pickup
                                          </SelectItem>
                                       </SelectContent>
                                    </Select>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        )}

                     {selectedProduct?.type &&
                        selectedProduct.type === SupplierItemType.OTHERS && (
                           <FormField
                              control={form.control}
                              name="waybillNo"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Nomor Surat Jalan</FormLabel>
                                    <FormControl>
                                       <Input
                                          type="text"
                                          placeholder="Masukkan surat jalan"
                                          disabled={isPending}
                                          {...field}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        )}
                  </div>

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
