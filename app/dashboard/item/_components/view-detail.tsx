'use client';

import { useForm } from 'react-hook-form';
import { Item, ItemType, UnitType } from '@prisma/client';

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
import { Checkbox } from '@/components/ui/checkbox';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';

interface ViewDetailProps {
   data: Item;
   itemTypes: ItemType[];
}

export function ViewDetail({ data, itemTypes }: ViewDetailProps) {
   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Rincian Item
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormItem>
                     <FormLabel>Nama</FormLabel>
                     <FormControl>
                        <Input defaultValue={data.name} type="text" disabled />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Key</FormLabel>
                     <FormControl>
                        <Input defaultValue={data.key} type="text" disabled />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Tipe Item</FormLabel>
                     <FormControl>
                        <Select value={data.typeId || undefined} disabled>
                           <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe item" />
                           </SelectTrigger>
                           <SelectContent>
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
                  </FormItem>

                  <FormItem>
                     <FormLabel>Satuan Item</FormLabel>
                     <Select defaultValue={data.unit} disabled>
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="Satuan item" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value={UnitType.KG}>Kilogram</SelectItem>
                           <SelectItem value={UnitType.LTR}>Liter</SelectItem>
                           <SelectItem value={UnitType.PCS}>Keping</SelectItem>
                           <SelectItem value={UnitType.TON}>Ton</SelectItem>
                        </SelectContent>
                     </Select>
                  </FormItem>

                  <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-md border p-4 shadow-sm">
                     <FormControl>
                        <Checkbox checked={data.isWeighted} disabled />
                     </FormControl>
                     <div className="space-y-1 leading-none">
                        <FormLabel>Apakah item melewati timbangan?</FormLabel>
                        <FormDescription>
                           Pilih opsi ini jika item harus ditimbang sebelum
                           diproses atau dijual.
                        </FormDescription>
                     </div>
                  </FormItem>

                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                     <FormControl>
                        <Checkbox checked={data.isSalable} disabled />
                     </FormControl>
                     <div className="space-y-1 leading-none">
                        <FormLabel>Apakah item dapat dijual?</FormLabel>
                        <FormDescription>
                           Pilih opsi ini jika item tersedia untuk dijual kepada
                           pembeli.
                        </FormDescription>
                     </div>
                  </FormItem>

                  <FormItem className="col-span-2">
                     <FormLabel>Deskripsi</FormLabel>
                     <FormControl>
                        <Textarea
                           defaultValue={data.description || undefined}
                           className="resize-none"
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Dibuat Pada</FormLabel>
                     <FormControl>
                        <Input
                           type="text"
                           defaultValue={
                              data.createdAt
                                 ? new Date(data.createdAt).toLocaleDateString()
                                 : 'N/A'
                           }
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Terakhir di Perbaharui</FormLabel>
                     <FormControl>
                        <Input
                           type="text"
                           defaultValue={
                              data.updatedAt
                                 ? new Date(data.updatedAt).toLocaleDateString()
                                 : 'N/A'
                           }
                           disabled
                        />
                     </FormControl>
                  </FormItem>
               </div>
            </Form>
         </CardContent>
      </Card>
   );
}
