'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { searchOutgoingParams } from '@/lib/params/outgoing';

export function useTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchOutgoingParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchOutgoingParams.page.withDefault(1)
   );

   const [dateRangeFilter, setDateRangeFilter] = useQueryState(
      'dateRange',
      searchOutgoingParams.dateRange.withOptions({
         shallow: false,
         throttleMs: 1000
      })
   );

   const [locationFilter, setLocationFilter] = useQueryState(
      'location',
      searchOutgoingParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const [buyerFilter, setBuyerFilter] = useQueryState(
      'buyer',
      searchOutgoingParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const [itemFilter, setItemFilter] = useQueryState(
      'item',
      searchOutgoingParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setDateRangeFilter(null);
      setLocationFilter(null);
      setBuyerFilter(null);
      setItemFilter(null);
      setPage(1);
   }, [
      setSearchQuery,
      setPage,
      setDateRangeFilter,
      setLocationFilter,
      setItemFilter
   ]);

   const isAnyFilterActive = useMemo(() => {
      return (
         !!searchQuery ||
         !!dateRangeFilter ||
         !!locationFilter ||
         !!buyerFilter ||
         !!itemFilter
      );
   }, [searchQuery, dateRangeFilter, locationFilter, buyerFilter, itemFilter]);

   return {
      searchQuery,
      setSearchQuery,
      dateRangeFilter,
      setDateRangeFilter,
      locationFilter,
      setLocationFilter,
      buyerFilter,
      setBuyerFilter,
      itemFilter,
      setItemFilter,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
