'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Buyer } from '@prisma/client';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Buyer>[] = [
   {
      id: 'rowNumber',
      header: 'No',
      cell: ({ row }) => row.index + 1 + '.',
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
      accessorKey: 'phone',
      header: 'No telepon'
   },
   {
      accessorKey: 'address',
      header: 'Alamat'
   },
   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
