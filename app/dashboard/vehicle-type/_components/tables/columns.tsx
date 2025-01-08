'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { VehicleType } from '@prisma/client';

export const columns: ColumnDef<VehicleType>[] = [
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
      accessorKey: 'unloadingCost',
      header: 'Biaya Bongkar'
   },
   {
      accessorKey: 'loadingCost',
      header: 'Biaya Muat'
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
