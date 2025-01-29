'use client';

import { useForm } from 'react-hook-form';
import {
   Item,
   Location,
   Supplier,
   SupplierItem,
   SupplierItemType
} from '@prisma/client';

import {
   Form,
   FormControl,
   FormDescription,
   FormItem,
   FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';

interface ViewDetailProps {
   data: SupplierItem;
   locations: Location[];
   suppliers: Supplier[];
   items: Item[];
}

export function ViewDetail({
   data,
   locations,
   suppliers,
   items
}: ViewDetailProps) {
   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Rincian Pemasok
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <FormItem>
                        <FormLabel>Pabrik</FormLabel>
                        <FormControl>
                           <Select
                              value={data.locationId || undefined}
                              disabled
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="N/A" />
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
                     </FormItem>

                     <FormItem>
                        <FormLabel>Pemasok</FormLabel>
                        <FormControl>
                           <Select
                              value={data.supplierId || undefined}
                              disabled
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="N/A" />
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
                     </FormItem>

                     <FormItem>
                        <FormLabel>Produk</FormLabel>
                        <FormControl>
                           <Select value={data.itemId || undefined} disabled>
                              <SelectTrigger>
                                 <SelectValue placeholder="N/A" />
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
                     </FormItem>

                     <FormItem>
                        <FormLabel>Tipe produk</FormLabel>
                        <Select defaultValue={data.type} disabled>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder="N/A" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectItem value={SupplierItemType.WEIGH}>
                                 Buah
                              </SelectItem>
                              <SelectItem value={SupplierItemType.REWEIGH}>
                                 Buah Ulangan
                              </SelectItem>
                              <SelectItem value={SupplierItemType.OTHERS}>
                                 Lainnya
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </FormItem>

                     {form.watch('type') !== 'OTHERS' && (
                        <FormItem>
                           <FormLabel>Referensi Harga (Rp)</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 defaultValue={data.price || undefined}
                                 disabled
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  </div>

                  <FormItem>
                     <FormLabel>Dibuat Pada</FormLabel>
                     <FormDescription>
                        {formatDate(data.createdAt)}
                     </FormDescription>
                  </FormItem>
               </div>
            </Form>
         </CardContent>
      </Card>
   );
}
