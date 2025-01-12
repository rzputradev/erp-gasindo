'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Permission } from '@prisma/client';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Permission>[] = [
   {
      id: 'rowNumber',
      header: 'No',
      cell: ({ row }) => row.index + 1 + '.',
      enableSorting: false,
      enableHiding: false
   },
   {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => <p className="line-clamp-1">{row.original.name}</p>
   },
   {
      accessorKey: 'key',
      header: 'Key'
   },
   {
      accessorKey: 'description',
      header: 'Keterangan',
      cell: ({ row }) => (
         <p className="line-clamp-1 max-w-xl">{row.original.description}</p>
      )
   },
   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
