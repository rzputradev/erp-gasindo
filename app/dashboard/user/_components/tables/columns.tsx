'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Gender, User } from '@prisma/client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const columns: ColumnDef<User>[] = [
   {
      id: 'select',
      header: 'Pengguna',
      cell: ({ row }) => (
         <div className="flex items-center space-x-4">
            <Avatar className="size-8">
               {row.original.image ? (
                  <AvatarImage src={row.original.image} alt="Profile Image" />
               ) : (
                  <AvatarFallback>
                     {row.original.name
                        ? row.original.name[0].toUpperCase()
                        : 'N/A'}
                  </AvatarFallback>
               )}
            </Avatar>
            <span>{row.original.name}</span>
         </div>
      ),
      enableSorting: false,
      enableHiding: false
   },
   {
      accessorKey: 'name',
      header: 'Nama'
   },
   {
      accessorKey: 'gender',
      header: 'Jenis Kelamin',
      cell: ({ row }) => {
         const gender = row.original.gender;
         return gender === Gender.FEMALE
            ? 'Perempuan'
            : gender === Gender.MALE
              ? 'Laki-laki'
              : 'Lain-lain';
      }
   },
   {
      accessorKey: 'email',
      header: 'Email'
   },
   {
      accessorKey: 'location.name',
      header: 'Tempat Kerja'
   },
   {
      accessorKey: 'role.name',
      header: 'Role'
   },
   {
      id: 'actions',
      // header: 'ACTION',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
