import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsJson,
   parseAsString
} from 'nuqs/server';
import * as z from 'zod';

const dateRangeSchema = z.object({
   start: z.date(),
   end: z.date()
});

export const searchOutgoingParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   location: parseAsString,
   buyer: parseAsString,
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

export const searchOutgoingParamsCache =
   createSearchParamsCache(searchOutgoingParams);
export const serialize = createSerializer(searchOutgoingParams);
