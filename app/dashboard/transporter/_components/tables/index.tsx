'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { useTableFilters } from './use-table-filters';
import { Location, Transporter } from '@prisma/client';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

interface TableProps {
   data: Transporter[];
   totalData: number;
   locations: Location[];
}

export function Table({ data, totalData, locations }: TableProps) {
   const LOCATION_OPTIONS = locations.map((location) => ({
      value: location.id,
      label: location.name
   }));

   const {
      isAnyFilterActive,
      resetFilters,
      searchQuery,
      locationFilter,
      setPage,
      setSearchQuery,
      setLocationFilter
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
            <DataTableFilterBox
               filterKey="location"
               title="Lokasi"
               options={LOCATION_OPTIONS}
               setFilterValue={setLocationFilter}
               filterValue={locationFilter}
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
