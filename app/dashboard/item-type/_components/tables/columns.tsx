'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ItemType } from '@prisma/client';

import { CellAction } from './cell-action';

export const columns: ColumnDef<ItemType>[] = [
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
      accessorKey: 'description',
      header: 'Keterangan'
   },
   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
