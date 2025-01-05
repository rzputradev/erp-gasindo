'use client';

import { searchLocationParams } from '@/lib/params/location';
import { LocationType } from '@prisma/client';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const LOCATION_TYPE_OPTIONS = [
   { value: LocationType.OFFICE, label: 'Kantor' },
   { value: LocationType.MILL, label: 'Pabrik' },
   { value: LocationType.WAREHOUSE, label: 'Gudang' }
];

export function useLocationTableFilters() {
   const [searchQuery, setSearchQuery] = useQueryState(
      'q',
      searchLocationParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [typeFilter, setTypeFilter] = useQueryState(
      'type',
      searchLocationParams.type.withOptions({ shallow: false }).withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchLocationParams.page.withDefault(1)
   );

   const resetFilters = useCallback(() => {
      setSearchQuery(null);
      setTypeFilter(null);

      setPage(1);
   }, [setSearchQuery, setTypeFilter, setPage]);

   const isAnyFilterActive = useMemo(() => {
      return !!searchQuery || !!typeFilter;
   }, [searchQuery, typeFilter]);

   return {
      searchQuery,
      setSearchQuery,
      typeFilter,
      setTypeFilter,
      page,
      setPage,
      resetFilters,
      isAnyFilterActive
   };
}
