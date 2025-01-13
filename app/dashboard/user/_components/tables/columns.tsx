'use client';

import { ColumnDef } from '@tanstack/react-table';
import { User, UserStatus } from '@prisma/client';

import { CellAction } from './cell-action';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<User>[] = [
   {
      id: 'rowNumber',
      header: 'No',
      cell: ({ row, table }) => {
         // Access pagination state
         const pageIndex = table.getState().pagination.pageIndex;
         const pageSize = table.getState().pagination.pageSize;

         // Calculate the row number based on pagination
         return pageIndex * pageSize + row.index + 1 + '.';
      },
      enableSorting: false,
      enableHiding: false
   },
   {
      id: 'select',
      header: 'Pengguna',
      cell: ({ row }) => (
         <div className="flex items-center space-x-4">
            <Avatar className="size-8">
               {row.original.image ? (
                  <AvatarImage
                     src={`/api/images${row.original.image}`}
                     alt="Profile Image"
                  />
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
      accessorKey: 'status',
      header: 'Status Akun',
      cell: ({ row }) => {
         const status = row.original.status;

         if (status === UserStatus.ACTIVE) {
            return <Badge variant={'default'}>Aktif</Badge>;
         } else if (status === UserStatus.SUSPENDED) {
            return <Badge variant={'secondary'}>Ditangguhkan</Badge>;
         } else if (status === UserStatus.BLOCKED) {
            return <Badge variant="destructive">Diblokir</Badge>;
         }
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
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
