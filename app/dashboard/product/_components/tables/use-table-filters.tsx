'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { searchOutgoingParams } from '@/lib/params/product';

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

   const [locationFilter, setLocationFilter] = useQueryState(
      'location',
      searchOutgoingParams.location
         .withOptions({ shallow: false })
         .withDefault('')
   );

   const [supplierFilter, setSupplierFilter] = useQueryState(
      'supplier',
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
      setLocationFilter(null);
      setSupplierFilter(null);
      setItemFilter(null);
      setPage(1);
   }, [
      setSearchQuery,
      setPage,
      setLocationFilter,
      setSupplierFilter,
      setItemFilter
   ]);

   const isAnyFilterActive = useMemo(() => {
      return (
         !!searchQuery || !!locationFilter || !!supplierFilter || !!itemFilter
      );
   }, [searchQuery || locationFilter || supplierFilter || itemFilter]);

   return {
      searchQuery,
      setSearchQuery,
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
