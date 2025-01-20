'use client';

import { useForm } from 'react-hook-form';
import { Item, ItemCategory, UnitType } from '@prisma/client';

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
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface ViewDetailProps {
   data: Item & { categories?: ItemCategory[] };
}

export function ViewDetail({ data }: ViewDetailProps) {
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
                     <FormLabel>Satuan</FormLabel>
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

                  <FormItem>
                     <FormLabel>Kategori</FormLabel>
                     <FormControl>
                        <div className="flex flex-wrap gap-2">
                           {data.categories && data.categories.length > 0 ? (
                              data.categories.map((category) => (
                                 <Badge
                                    key={category.id}
                                    variant="outline"
                                    className="flex cursor-not-allowed items-center space-x-2 text-sm font-normal text-muted-foreground"
                                 >
                                    <span>{category?.name}</span>
                                    <Check className="size-3 text-green-500" />
                                 </Badge>
                              ))
                           ) : (
                              <span className="text-sm text-gray-500">
                                 Tidak ada kategori yang terkait
                              </span>
                           )}
                        </div>
                     </FormControl>
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
                     <FormDescription>
                        {data.createdAt
                           ? new Date(data.createdAt).toLocaleString()
                           : 'N/A'}
                     </FormDescription>
                  </FormItem>
               </div>
            </Form>
         </CardContent>
      </Card>
   );
}
