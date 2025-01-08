'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { useLocationTableFilters } from './use-table-filters';
import { Item, ItemType } from '@prisma/client';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

interface TableProps {
   data: Item[];
   totalData: number;
   itemTypes: ItemType[];
}

export function Table({ data, totalData, itemTypes }: TableProps) {
   const ITEM_TYPE_OPTIONS = itemTypes.map((itemType) => ({
      value: itemType.id,
      label: itemType.name
   }));

   const {
      isAnyFilterActive,
      resetFilters,
      searchQuery,
      itemTypeFilter,
      setItemTypeFilter,
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
               filterKey="itemType"
               title="Tipe Item"
               options={ITEM_TYPE_OPTIONS}
               setFilterValue={setItemTypeFilter}
               filterValue={itemTypeFilter}
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
