'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { searchOrderParams } from '@/lib/params/order';

export function useTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchOrderParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchOrderParams.page.withDefault(1)
   );

   const [locationFilter, setLocationFilter] = useQueryState(
      'location',
      searchOrderParams.location.withOptions({ shallow: false }).withDefault('')
   );

   const [buyerFilter, setBuyerFilter] = useQueryState(
      'buyer',
      searchOrderParams.location.withOptions({ shallow: false }).withDefault('')
   );

   const [itemFilter, setItemFilter] = useQueryState(
      'item',
      searchOrderParams.location.withOptions({ shallow: false }).withDefault('')
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
