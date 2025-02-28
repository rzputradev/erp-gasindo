import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsJson,
   parseAsString
} from 'nuqs/server';

export const searchIncomingParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   location: parseAsString,
   supplier: parseAsString,
   item: parseAsString,
   dateRange: parseAsJson((value) => {
      if (typeof value !== 'object' || value === null) return undefined;
      const { from, to } = value as { from?: string; to?: string };
      return {
         from: from ? new Date(from) : undefined,
         to: to ? new Date(to) : undefined
      };
   })
};

export const searchIncomingParamsCache =
   createSearchParamsCache(searchIncomingParams);
export const serialize = createSerializer(searchIncomingParams);
