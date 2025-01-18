'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { useTableFilters } from './use-table-filters';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Buyer, Item, Location } from '@prisma/client';

interface TableActionsProps {
   locations: Location[];
   buyers: Buyer[];
   items: Item[];
}

export function TableAction({ locations, buyers, items }: TableActionsProps) {
   const LOCATION_OPTIONS = locations.map((location) => ({
      value: location.id,
      label: location.name
   }));
   const BUYER_OPTIONS = buyers.map((buyer) => ({
      value: buyer.id,
      label: buyer.name
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
      buyerFilter,
      setBuyerFilter,
      itemFilter,
      setItemFilter,
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
               title="Pabrik"
               options={LOCATION_OPTIONS}
               setFilterValue={setLocationFilter}
               filterValue={locationFilter}
            />
            <DataTableFilterBox
               filterKey="buyer"
               title="Pembeli"
               options={BUYER_OPTIONS}
               setFilterValue={setBuyerFilter}
               filterValue={buyerFilter}
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
