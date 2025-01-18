'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Contract, SalesStatus } from '@prisma/client';

import { CellAction } from './cell-action';
import { formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Contract>[] = [
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
      accessorKey: 'contractNo',
      header: 'Nomor Kontrak'
   },
   {
      // accessorKey: 'price',
      header: 'Harga',
      cell: ({ row }) => `Rp. ${formatNumber(row.original.price)}`
   },
   {
      // accessorKey: 'totalQty',
      header: 'Kuantitas',
      cell: ({ row }) => `${formatNumber(row.original.quantity)} Kg`
   },
   {
      // accessorKey: 'remainingQty',
      header: 'Sisa Kuantitas',
      cell: ({ row }) => `${formatNumber(row.original.remainingQty)} Kg`
   },
   {
      // accessorKey: 'toleranceWeigh',
      header: 'Toleransi',
      cell: ({ row }) => `${formatNumber(row.original.toleranceWeigh || 0)} Kg`
   },
   // {
   //    accessorKey: 'location.name',
   //    header: 'Lokasi Pengambilan'
   // },
   {
      // accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
         const status = row.original.status;

         if (status === SalesStatus.PENDING) {
            return <Badge variant={'secondary'}>Ditunda</Badge>;
         } else if (status === SalesStatus.ACTIVE) {
            return <Badge variant={'default'}>Aktif</Badge>;
         } else if (status === SalesStatus.CANCELED) {
            return <Badge variant="destructive">Di Batalkan</Badge>;
         } else if (status === SalesStatus.COMPLETED) {
            return <Badge variant="outline">Selesai</Badge>;
         }
      }
   },
   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
