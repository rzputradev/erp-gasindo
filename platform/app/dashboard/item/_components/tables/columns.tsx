'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Item, ItemCategory, UnitType } from '@prisma/client';

import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export const columns: ColumnDef<Item & { categories?: ItemCategory[] }>[] = [
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
   // {
   //    accessorKey: 'key',
   //    header: 'Key'
   // },
   {
      header: 'Kategori',
      cell: ({ row }) => {
         const categories = row.original.categories;

         if (!categories || categories.length === 0) {
            return <span>Tidak ada kategori</span>;
         }

         return (
            <div className="space-y-1">
               {categories.map((category) => (
                  <Badge
                     key={category.id}
                     variant="outline"
                     className="flex w-max items-center space-x-2 text-sm font-normal"
                  >
                     <span>{category?.name}</span>
                     <Check className="size-3 text-green-500" />
                  </Badge>
               ))}
            </div>
         );
      }
   },
   {
      accessorKey: 'unit',
      header: 'Satuan',
      cell: ({ row }) => {
         const unit = row.original.unit;

         if (unit === UnitType.KG) {
            return <span>Kilogram</span>;
         } else if (unit === UnitType.LTR) {
            return <span>Liter</span>;
         } else if (unit === UnitType.PCS) {
            return <span>Keping</span>;
         } else if (unit === UnitType.TON) {
            return <span>Ton</span>;
         }
      }
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
