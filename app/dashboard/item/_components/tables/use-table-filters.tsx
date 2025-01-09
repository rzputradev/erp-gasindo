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

   const [itemTypeFilter, setItemTypeFilter] = useQueryState(
      'itemType',
      searchItemParams.itemType.withOptions({ shallow: false }).withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchItemParams.page.withDefault(1)
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setItemTypeFilter(null);

      setPage(1);
   }, [setSearchQuery, setItemTypeFilter, setPage]);

   const isAnyFilterActive = useMemo(() => {
      return !!searchQuery || !!itemTypeFilter;
   }, [searchQuery, itemTypeFilter]);

   return {
      searchQuery,
      setSearchQuery,
      itemTypeFilter,
      setItemTypeFilter,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
