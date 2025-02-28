'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { searchIncomingParams } from '@/lib/params/incoming';

export function useTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchIncomingParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchIncomingParams.page.withDefault(1)
   );

   const [dateRangeFilter, setDateRangeFilter] = useQueryState(
      'dateRange',
      searchIncomingParams.dateRange.withOptions({
         shallow: false,
         throttleMs: 1000
      })
   );

   const [locationFilter, setLocationFilter] = useQueryState(
      'location',
      searchIncomingParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const [supplierFilter, setSupplierFilter] = useQueryState(
      'supplier',
      searchIncomingParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const [itemFilter, setItemFilter] = useQueryState(
      'item',
      searchIncomingParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setDateRangeFilter(null);
      setLocationFilter(null);
      setSupplierFilter(null);
      setItemFilter(null);
      setPage(1);
   }, [
      setSearchQuery,
      setPage,
      setDateRangeFilter,
      setLocationFilter,
      setSupplierFilter,
      setItemFilter
   ]);

   const isAnyFilterActive = useMemo(() => {
      return (
         !!searchQuery ||
         !!dateRangeFilter ||
         !!locationFilter ||
         !!supplierFilter ||
         !!itemFilter
      );
   }, [
      searchQuery,
      dateRangeFilter,
      locationFilter,
      supplierFilter,
      itemFilter
   ]);

   return {
      searchQuery,
      setSearchQuery,
      dateRangeFilter,
      setDateRangeFilter,
      locationFilter,
      setLocationFilter,
      supplierFilter,
      setSupplierFilter,
      itemFilter,
      setItemFilter,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
