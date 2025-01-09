'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Transporter } from '@prisma/client';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Transporter>[] = [
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
      accessorKey: 'location.name',
      header: 'Lokasi'
   },
   {
      accessorKey: 'phone',
      header: 'No Handphone'
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
