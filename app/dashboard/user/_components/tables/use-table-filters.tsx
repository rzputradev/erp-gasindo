'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { searchUserParams } from '@/lib/params/user';

export function useTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchUserParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchUserParams.page.withDefault(1)
   );

   const [roleFilter, setRoleFilter] = useQueryState(
      'role',
      searchUserParams.location.withOptions({ shallow: false }).withDefault('')
   );

   const [locationFilter, setLocationFilter] = useQueryState(
      'location',
      searchUserParams.location.withOptions({ shallow: false }).withDefault('')
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setLocationFilter(null);
      setRoleFilter(null);

      setPage(1);
   }, [setSearchQuery, setLocationFilter, setRoleFilter, setPage]);

   const isAnyFilterActive = useMemo(() => {
      return !!searchQuery || !!locationFilter || !!roleFilter;
   }, [searchQuery, locationFilter, roleFilter]);

   return {
      searchQuery,
      setSearchQuery,
      locationFilter,
      setLocationFilter,
      roleFilter,
      setRoleFilter,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
