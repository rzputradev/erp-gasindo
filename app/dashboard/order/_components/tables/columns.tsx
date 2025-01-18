'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Contract, Order, SalesStatus } from '@prisma/client';

import { CellAction } from './cell-action';
import { formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Order & { contract?: Contract }>[] = [
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
      accessorKey: 'orderNo',
      header: 'Nomor Pengambilan'
   },
   {
      // accessorKey: 'price',
      accessorKey: 'contract.contractNo',
      header: 'Nomor Kontrak'
   },
   {
      // accessorKey: 'price',
      header: 'Kuantitas',
      cell: ({ row }) => `${formatNumber(row.original.quantity)} Kg`
   },
   {
      // accessorKey: 'remainingQty',
      header: 'Sisa Kuantitas',
      cell: ({ row }) => `${formatNumber(row.original.remainingQty)} Kg`
   },
   {
      // accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
         const status = row.original.status;

         if (status === SalesStatus.PENDING) {
            return <Badge variant={'secondary'}>Ditunda</Badge>;
         } else if (status === SalesStatus.ACTIVE) {
            return <Badge variant={'default'}>Dalam Proses</Badge>;
         } else if (status === SalesStatus.COMPLETED) {
            return <Badge variant="outline">Selesai</Badge>;
         } else if (status === SalesStatus.CANCELED) {
            return <Badge variant="destructive">Dibatalkan</Badge>;
         }
      }
   },
   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
