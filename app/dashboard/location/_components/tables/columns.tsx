'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Location, LocationType } from '@prisma/client';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Location>[] = [
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
      header: 'Kode'
   },
   {
      accessorKey: 'type',
      header: 'Tipe',
      cell: ({ row }) => {
         const type = row.original.type;
         return type === LocationType.OFFICE
            ? 'Kantor'
            : type === LocationType.MILL
              ? 'Pabrik'
              : type === LocationType.WAREHOUSE
                ? 'Gudang'
                : 'Lain-lain';
      }
   },
   {
      accessorKey: 'address',
      header: 'Alamat',
      cell: ({ row }) => (
         <p className="line-clamp-2 lg:truncate">{row.original.address}</p>
      )
   },

   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
