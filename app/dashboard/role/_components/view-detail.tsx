'use client';

import { useForm } from 'react-hook-form';
import { Permission, Role, RolePermission } from '@prisma/client';

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
import { Switch } from '@/components/ui/switch';

interface ViewDetailProps {
   data: Role & {
      permissions?: RolePermission[];
   };
   allPermissions?: Permission[];
}

export function ViewDetail({ data, allPermissions }: ViewDetailProps) {
   const activePermissions: (string | undefined)[] =
      data.permissions?.map((perm) => perm.permissionId ?? undefined) || [];

   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-md">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Rincian Peran
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

               <FormItem className="mt-8">
                  <div className="mb-4">
                     <FormLabel className="text-lg font-semibold">
                        Izin Aktif
                     </FormLabel>
                     <FormDescription>
                        Izin yang dimiliki oleh role ini
                     </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                     {allPermissions
                        ?.filter((permission) =>
                           activePermissions.includes(permission.id)
                        )
                        .map((permission) => (
                           <FormItem
                              key={permission.id}
                              className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
                           >
                              <div className="space-y-0.5">
                                 <FormLabel>{permission.name}</FormLabel>
                                 <FormDescription className="line-clamp-1">
                                    {permission.key}
                                 </FormDescription>
                              </div>
                              <FormControl>
                                 <Switch disabled checked={true} />
                              </FormControl>
                           </FormItem>
                        ))}
                  </div>
               </FormItem>
            </Form>
         </CardContent>
      </Card>
   );
}
