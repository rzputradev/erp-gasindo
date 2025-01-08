'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Item } from '@prisma/client';

export const columns: ColumnDef<Item>[] = [
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
      accessorKey: 'itemType.name',
      header: 'Tipe Item'
   },
   {
      accessorKey: 'unit',
      header: 'Satuan'
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
