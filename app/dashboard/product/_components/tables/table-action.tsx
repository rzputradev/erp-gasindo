'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useTableFilters } from './use-table-filters';
import { Item, Location, Supplier } from '@prisma/client';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

interface TableActionsProps {
   locations: Location[];
   suppliers: Supplier[];
   items: Item[];
}

export function TableAction({
   locations,
   suppliers,
   items
}: TableActionsProps) {
   const LOCATION_OPTIONS = locations.map((location) => ({
      value: location.id,
      label: location.name
   }));
   const SUPPLIER_OPTIONS = suppliers.map((supplier) => ({
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
      <div className="space-y-4">
         <div className="flex flex-wrap items-center gap-4">
            <DataTableSearch
               searchKey="nama"
               searchQuery={searchQuery}
               setSearchQuery={setSearchQuery}
               setPage={setPage}
            />

            <DataTableFilterBox
               filterKey="location"
               title="Pabrik"
               options={LOCATION_OPTIONS}
               setFilterValue={setLocationFilter}
               filterValue={locationFilter}
            />

            <DataTableFilterBox
               filterKey="supplier"
               title="Pemasok"
               options={SUPPLIER_OPTIONS}
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
      </div>
   );
}
