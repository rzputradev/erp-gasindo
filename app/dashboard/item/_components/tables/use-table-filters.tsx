'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { searchItemParams } from '@/lib/params/item';

export function useLocationTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchItemParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [itemCategoryFilter, setItemCategoryFilter] = useQueryState(
      'itemCategory',
      searchItemParams.itemCategory
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchItemParams.page.withDefault(1)
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setItemCategoryFilter(null);

      setPage(1);
   }, [setSearchQuery, setItemCategoryFilter, setPage]);

   const isAnyFilterActive = useMemo(() => {
      return !!searchQuery || !!itemCategoryFilter;
   }, [searchQuery, itemCategoryFilter]);

   return {
      searchQuery,
      setSearchQuery,
      itemCategoryFilter,
      setItemCategoryFilter,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
