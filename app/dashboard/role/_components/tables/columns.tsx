'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Role } from '@prisma/client';

export const columns: ColumnDef<Role>[] = [
   {
      id: 'rowNumber',
      header: 'No',
      cell: ({ row }) => row.index + 1 + `.`,
      enableSorting: false,
      enableHiding: false
   },
   {
      accessorKey: 'name',
      header: 'Nama'
   },
   {
      accessorKey: 'key',
      header: 'Key'
   },
   {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
         <p className="line-clamp-2 lg:max-w-xl lg:truncate">
            {row.original.description}
         </p>
      )
   },

   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
