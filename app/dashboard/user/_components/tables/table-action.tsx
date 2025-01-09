'use client';

import { Location, Role } from '@prisma/client';

import { useTableFilters } from './use-table-filters';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

interface TableProps {
   locations: Location[];
   roles: Role[];
}

export function TableAction({ locations, roles }: TableProps) {
   const LOCATION_OPTIONS = locations.map((location) => ({
      value: location.id,
      label: location.name
   }));
   const ROLES_OPTIONS = roles.map((role) => ({
      value: role.id,
      label: role.name
   }));

   const {
      locationFilter,
      setLocationFilter,
      roleFilter,
      setRoleFilter,
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
            <DataTableFilterBox
               filterKey="location"
               title="Lokasi Kerja"
               options={LOCATION_OPTIONS}
               setFilterValue={setLocationFilter}
               filterValue={locationFilter}
            />
            <DataTableFilterBox
               filterKey="role"
               title="Role"
               options={ROLES_OPTIONS}
               setFilterValue={setRoleFilter}
               filterValue={roleFilter}
            />
            <DataTableResetFilter
               isFilterActive={!!isAnyFilterActive}
               onReset={resetFilters}
            />
         </div>
      </div>
   );
}
