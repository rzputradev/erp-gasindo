'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableFilterDateRange } from '@/components/ui/table/data-table-filter-date-range';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Item, Location, Supplier } from '@prisma/client';
import { useTableFilters } from './use-table-filters';

interface TableActionsProps {
   locations: Location[];
   suppliers: Supplier[];
   items: Item[];
   multiLocationAccess: boolean;
}

export function TableAction({
   locations,
   suppliers,
   items,
   multiLocationAccess
}: TableActionsProps) {
   const LOCATION_OPTIONS = locations.map((location) => ({
      value: location.id,
      label: location.name
   }));
   const SUPLIER_OPTIONS = suppliers.map((supplier) => ({
      value: supplier.id,
      label: supplier.name
   }));
   const ITEM_OPTIONS = items.map((item) => ({
      value: item.id,
      label: item.name
   }));

   const {
      isAnyFilterActive,
      resetFilters,
      searchQuery,
      dateRangeFilter,
      setDateRangeFilter,
      locationFilter,
      setLocationFilter,
      supplierFilter,
      setSupplierFilter,
      itemFilter,
      setItemFilter,
      setPage,
      setSearchQuery
   } = useTableFilters();

   return (
      <div className="flex max-w-[90%] flex-wrap items-center gap-4">
         <DataTableSearch
            searchKey="nomor tiket"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
         />

         <DataTableFilterDateRange
            setPage={setPage}
            dateRange={dateRangeFilter}
            setDateRange={setDateRangeFilter}
         />

         {multiLocationAccess && (
            <DataTableFilterBox
               filterKey="location"
               title="Pabrik"
               options={LOCATION_OPTIONS}
               setFilterValue={setLocationFilter}
               filterValue={locationFilter}
            />
         )}

         <DataTableFilterBox
            filterKey="supplier"
            title="Pemasok"
            options={SUPLIER_OPTIONS}
            setFilterValue={setSupplierFilter}
            filterValue={supplierFilter}
         />

         <DataTableFilterBox
            filterKey="item"
            title="Produk"
            options={ITEM_OPTIONS}
            setFilterValue={setItemFilter}
            filterValue={itemFilter}
         />

         <DataTableResetFilter
            isFilterActive={isAnyFilterActive}
            onReset={resetFilters}
         />
      </div>
   );
}
