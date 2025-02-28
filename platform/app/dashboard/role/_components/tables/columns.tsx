'use client';

import { Role } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Role>[] = [
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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
         <p className="line-clamp-2 lg:max-w-xl lg:truncate">
            {row.original.description}
         </p>
      )
   },

   {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
   }
];
