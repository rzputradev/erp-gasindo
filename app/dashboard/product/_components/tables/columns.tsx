'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Supplier, SupplierItem } from '@prisma/client';

import { CellAction } from './cell-action';
import { formatNumber } from '@/lib/utils';

export const columns: ColumnDef<SupplierItem>[] = [
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
      accessorKey: 'item.name',
      header: 'Produk'
   },
   {
      accessorKey: 'supplier.name',
      header: 'Pemasok'
   },
   {
      accessorKey: 'location.name',
      header: 'Pabrik'
   },
   {
      id: 'price',
      header: 'Harga',
      cell: ({ row }) => {
         if (row.original.type !== 'OTHERS') {
            return <p>Rp. {formatNumber(row.original.price || 0)}</p>;
         } else {
            return <p>N/A</p>;
         }
      }
   },
   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
