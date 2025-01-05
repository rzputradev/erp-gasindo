'use client';

import { searchPermissionParams } from '@/lib/params/permission';
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
      searchPermissionParams.q
         .withOptions({ shallow: false, throttleMs: 1000 })
         .withDefault('')
   );

   const [page, setPage] = useQueryState(
      'page',
      searchPermissionParams.page.withDefault(1)
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
