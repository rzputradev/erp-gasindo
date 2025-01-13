'use client';

import { useForm } from 'react-hook-form';
import { Location, LocationType } from '@prisma/client';
import {
   Form,
   FormControl,
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ViewDetailProps {
   data: Location;
}

export function ViewDetail({ data }: ViewDetailProps) {
   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Rincian Lokasi
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
                     <FormLabel>Tipe</FormLabel>
                     <Select defaultValue={data.type || undefined} disabled>
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="Pilih Tipe" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value={LocationType.OFFICE}>
                              Kantor
                           </SelectItem>
                           <SelectItem value={LocationType.MILL}>
                              Pabrik
                           </SelectItem>
                           <SelectItem value={LocationType.WAREHOUSE}>
                              Gudang
                           </SelectItem>
                        </SelectContent>
                     </Select>
                  </FormItem>

                  <FormItem className="col-span-2">
                     <FormLabel>Address</FormLabel>
                     <FormControl>
                        <Textarea
                           defaultValue={data.address}
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
