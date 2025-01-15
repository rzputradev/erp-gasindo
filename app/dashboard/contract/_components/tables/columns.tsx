'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Contract } from '@prisma/client';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Contract>[] = [
   // {
   //    id: 'rowNumber',
   //    header: 'No',
   //    cell: ({ row, table }) => {
   //       // Access pagination state
   //       const pageIndex = table.getState().pagination.pageIndex;
   //       const pageSize = table.getState().pagination.pageSize;

   //       // Calculate the row number based on pagination
   //       return pageIndex * pageSize + row.index + 1 + '.';
   //    },
   //    enableSorting: false,
   //    enableHiding: false
   // },
   {
      accessorKey: 'buyer.name',
      header: 'Pembeli'
   },
   {
      accessorKey: 'item.name',
      header: 'Produk'
   },
   {
      accessorKey: 'unitPrice',
      header: 'Harga'
   },
   {
      accessorKey: 'totalQty',
      header: 'Total'
   },
   {
      accessorKey: 'remainingQty',
      header: 'Sisa'
   },
   {
      accessorKey: 'toleranceWeigh',
      header: 'Toleransi'
   },
   {
      accessorKey: 'location.name',
      header: 'Lokasi Pengambilan'
   },
   {
      accessorKey: 'status',
      header: 'Status'
   },
   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
