'use client';

import { searchRoleParams } from '@/lib/params/role';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchRoleParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchRoleParams.page.withDefault(1)
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);

      setPage(1);
   }, [setSearchQuery, setPage]);

   const isAnyFilterActive = useMemo(() => {
      return !!searchQuery;
   }, [searchQuery]);

   return {
      searchQuery,
      setSearchQuery,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
