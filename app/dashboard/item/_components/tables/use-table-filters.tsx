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

   const [categoryFilter, setCategoryFilter] = useQueryState(
      'category',
      searchItemParams.category.withOptions({ shallow: false }).withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchItemParams.page.withDefault(1)
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setCategoryFilter(null);

      setPage(1);
   }, [setSearchQuery, setCategoryFilter, setPage]);

   const isAnyFilterActive = useMemo(() => {
      return !!searchQuery || !!categoryFilter;
   }, [searchQuery, categoryFilter]);

   return {
      searchQuery,
      setSearchQuery,
      categoryFilter,
      setCategoryFilter,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
