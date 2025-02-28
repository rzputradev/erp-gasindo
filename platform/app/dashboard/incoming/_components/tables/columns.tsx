'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
   IncomingScale,
   Item,
   OutgoingScale,
   SupplierItem,
   SupplierItemType
} from '@prisma/client';

import { CellAction } from './cell-action';
import { formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<IncomingScale & { item?: SupplierItem }>[] = [
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
      accessorKey: 'ticketNo',
      header: 'Nomor Tiket'
   },
   {
      accessorKey: 'item.item.name',
      header: 'Produk'
   },
   {
      accessorKey: 'driver',
      header: 'Pengemudi'
   },
   {
      id: 'weightIn',
      header: 'Tara',
      cell: ({ row }) => `${formatNumber(row.original.weightIn)} Kg`
   },
   {
      id: 'weightOut',
      header: 'Bruto',
      cell: ({ row }) => {
         const data = row.original;
         if (data.exitTime && data.weightOut) {
            return <p>{formatNumber(data.weightOut)} Kg</p>;
         } else {
            return <p>N/A</p>;
         }
      }
   },
   {
      id: 'finalWeight',
      header: 'Neto',
      cell: ({ row }) => {
         const data = row.original;
         if (data.exitTime && data.weightOut) {
            return <p>{formatNumber(data.weightIn - data.weightOut)} Kg</p>;
         } else {
            return <p>N/A</p>;
         }
      }
   },
   {
      id: 'sorting',
      header: 'Sorting',
      cell: ({ row }) => {
         const data = row.original;
         if (data.item?.type === SupplierItemType.WEIGH) {
            return <p>{data.sorting ? `${data.sorting} %` : 'N/A'}</p>;
         } else {
            return <p>N/A</p>;
         }
      }
   },
   {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
         if (row.original.exitTime) {
            return <Badge variant="outline">Selesai</Badge>;
         } else {
            return <Badge variant="default">Dimuat</Badge>;
         }
      }
   },
   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
