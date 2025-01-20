'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { searchSalesParams } from '@/lib/params/sales';

export function useTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchSalesParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchSalesParams.page.withDefault(1)
   );

   const [locationFilter, setLocationFilter] = useQueryState(
      'location',
      searchSalesParams.location.withOptions({ shallow: false }).withDefault('')
   );

   const [buyerFilter, setBuyerFilter] = useQueryState(
      'buyer',
      searchSalesParams.location.withOptions({ shallow: false }).withDefault('')
   );

   const [itemFilter, setItemFilter] = useQueryState(
      'item',
      searchSalesParams.location.withOptions({ shallow: false }).withDefault('')
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setLocationFilter(null);
      setBuyerFilter(null);
      setItemFilter(null);
      setPage(1);
   }, [setSearchQuery, setPage]);

   const isAnyFilterActive = useMemo(() => {
      return !!searchQuery || !!locationFilter || !!buyerFilter || !!itemFilter;
   }, [searchQuery, locationFilter, buyerFilter, itemFilter]);

   return {
      searchQuery,
      setSearchQuery,
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
