'use client';

import { useForm } from 'react-hook-form';
import { Gender, Location, Role, User, UserStatus } from '@prisma/client';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ViewDetailProps {
   data: User;
   locations: Location[];
   roles: Role[];
}

export function ViewDetail({ data, locations, roles }: ViewDetailProps) {
   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Rincian Pengguna
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <Avatar className="mb-4 size-16">
                  <AvatarImage
                     src={data.image ? `/api/images${data.image}` : undefined}
                     alt={data?.name || ''}
                  />
                  <AvatarFallback className="rounded-lg">
                     {data?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
                  </AvatarFallback>
               </Avatar>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormItem>
                     <FormLabel>Nama</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.name || undefined}
                           type="text"
                           disabled
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>

                  <FormItem>
                     <FormLabel>Tempat Kerja</FormLabel>
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
                     <FormMessage />
                  </FormItem>

                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.email || undefined}
                           type="email"
                           disabled
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>

                  <FormItem>
                     <FormLabel>Role</FormLabel>
                     <FormControl>
                        <Select
                           defaultValue={data.roleId || undefined}
                           disabled
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="N/A" />
                           </SelectTrigger>
                           <SelectContent>
                              {roles.length > 0 ? (
                                 roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                       {role.name}
                                    </SelectItem>
                                 ))
                              ) : (
                                 <div className="px-4 py-2 text-sm text-gray-500">
                                    Tidak ada role yang tersedia
                                 </div>
                              )}
                           </SelectContent>
                        </Select>
                     </FormControl>
                     <FormMessage />
                  </FormItem>

                  <FormItem>
                     <FormLabel>Status</FormLabel>
                     <Select defaultValue={data.status} disabled>
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="Status akun" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value={UserStatus.ACTIVE}>
                              Aktif
                           </SelectItem>
                           <SelectItem value={UserStatus.SUSPENDED}>
                              Ditangguhkan
                           </SelectItem>
                           <SelectItem value={UserStatus.BLOCKED}>
                              Di Blokir
                           </SelectItem>
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>

                  <FormItem>
                     <FormLabel>Jenis Kelamin</FormLabel>
                     <FormControl>
                        <RadioGroup
                           defaultValue={data.gender || undefined}
                           className="flex space-x-4"
                           disabled
                        >
                           <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                 <RadioGroupItem value={Gender.MALE} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                 Laki-laki
                              </FormLabel>
                           </FormItem>
                           <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                 <RadioGroupItem value={Gender.FEMALE} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                 Perempuan
                              </FormLabel>
                           </FormItem>
                        </RadioGroup>
                     </FormControl>
                     <FormMessage />
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
