'use client';

import { Location, Role } from '@prisma/client';

import { useTableFilters } from './use-table-filters';
import { columns } from './columns';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTable } from '@/components/ui/table/data-table';

interface TableProps {
   data: Role[];
   totalData: number;
}

export function Table({ data, totalData }: TableProps) {
   const {
      isAnyFilterActive,
      resetFilters,
      searchQuery,
      setPage,
      setSearchQuery
   } = useTableFilters();

   return (
      <div className="space-y-4">
         <div className="flex flex-wrap items-center gap-4">
            <DataTableSearch
               searchKey="name"
               searchQuery={searchQuery}
               setSearchQuery={setSearchQuery}
               setPage={setPage}
            />
            <DataTableResetFilter
               isFilterActive={isAnyFilterActive}
               onReset={resetFilters}
            />
         </div>
         <DataTable columns={columns} data={data} totalItems={totalData} />
      </div>
   );
}
