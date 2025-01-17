'use client';

import { ItemCategory } from '@prisma/client';

import { useLocationTableFilters } from './use-table-filters';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

interface TableActionProps {
   itemCategories: ItemCategory[];
}

export function TableAction({ itemCategories }: TableActionProps) {
   const ITEM_CATEGORY_OPTIONS = itemCategories.map((itemCategory) => ({
      value: itemCategory.id,
      label: itemCategory.name
   }));

   const {
      isAnyFilterActive,
      resetFilters,
      searchQuery,
      itemCategoryFilter,
      setItemCategoryFilter,
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
               filterKey="itemCategory"
               title="Kategori Barang"
               options={ITEM_CATEGORY_OPTIONS}
               setFilterValue={setItemCategoryFilter}
               filterValue={itemCategoryFilter}
            />
            <DataTableResetFilter
               isFilterActive={isAnyFilterActive}
               onReset={resetFilters}
            />
         </div>
      </div>
   );
}
