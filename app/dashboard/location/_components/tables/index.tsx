'use client';

import {
   LOCATION_TYPE_OPTIONS,
   useLocationTableFilters
} from './use-table-filters';
import { Location } from '@prisma/client';
import { columns } from './columns';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

export function Table({
   data,
   totalData
}: {
   data: Location[];
   totalData: number;
}) {
   const {
      typeFilter,
      setTypeFilter,
      isAnyFilterActive,
      resetFilters,
      searchQuery,
      setPage,
      setSearchQuery
   } = useLocationTableFilters();

   return (
      <div className="space-y-4">
         <div className="flex flex-wrap items-center gap-4">
            <DataTableSearch
               searchKey="name"
               searchQuery={searchQuery}
               setSearchQuery={setSearchQuery}
               setPage={setPage}
            />
            <DataTableFilterBox
               filterKey="type"
               title="Tipe Lokasi"
               options={LOCATION_TYPE_OPTIONS}
               setFilterValue={setTypeFilter}
               filterValue={typeFilter}
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
