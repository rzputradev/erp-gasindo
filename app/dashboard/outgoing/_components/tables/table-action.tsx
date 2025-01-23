'use client';

import { DataTableFilterDateRange } from '@/components/ui/table/data-table-filter-date-range';
import { useTableFilters } from './use-table-filters';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

export function TableAction() {
   const {
      isAnyFilterActive,
      resetFilters,
      searchQuery,
      dateRangeFilter,
      setDateRangeFilter,
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

            <DataTableFilterDateRange
               setPage={setPage}
               dateRange={dateRangeFilter}
               setDateRange={setDateRangeFilter}
            />

            <DataTableResetFilter
               isFilterActive={isAnyFilterActive}
               onReset={resetFilters}
            />
         </div>
      </div>
   );
}
