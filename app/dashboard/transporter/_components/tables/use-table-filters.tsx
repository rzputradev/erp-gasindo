'use client';

import { searchTransporterParams } from '@/lib/params/transporter';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchTransporterParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchTransporterParams.page.withDefault(1)
   );

   const [locationFilter, setLocationFilter] = useQueryState(
      'location',
      searchTransporterParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setLocationFilter(null);

      setPage(1);
   }, [setSearchQuery, setLocationFilter, setPage]);

   const isAnyFilterActive = useMemo(() => {
      return !!searchQuery || !!locationFilter;
   }, [searchQuery, locationFilter]);

   return {
      searchQuery,
      setSearchQuery,
      locationFilter,
      setLocationFilter,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
