'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { searchContractParams } from '@/lib/params/contract';

export function useTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchContractParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchContractParams.page.withDefault(1)
   );

   const [locationFilter, setLocationFilter] = useQueryState(
      'location',
      searchContractParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const [buyerFilter, setBuyerFilter] = useQueryState(
      'buyer',
      searchContractParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const [itemFilter, setItemFilter] = useQueryState(
      'item',
      searchContractParams.location
         .withOptions({ shallow: false })
         .withDefault('')
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
