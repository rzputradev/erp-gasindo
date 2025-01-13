'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Transporter } from '@prisma/client';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Transporter>[] = [
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
