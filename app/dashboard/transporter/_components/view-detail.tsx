'use client';

import { useForm } from 'react-hook-form';
import { Location, Transporter } from '@prisma/client';

import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';

interface ViewDetailProps {
   data: Transporter;
   locations: Location[];
}

export function ViewDetail({ data, locations }: ViewDetailProps) {
   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Rincian Pengangkutan
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
                     <FormLabel>No Handphone</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.phone || undefined}
                           type="text"
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Lokasi</FormLabel>
                     <FormControl>
                        <Select
                           defaultValue={data.locationId || undefined}
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
                                    Tidak ada lokasi yang tersedia
                                 </div>
                              )}
                           </SelectContent>
                        </Select>
                     </FormControl>
                  </FormItem>

                  <FormItem className="col-span-2">
                     <FormLabel>Alamat</FormLabel>
                     <FormControl>
                        <Textarea
                           defaultValue={data.address || undefined}
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
