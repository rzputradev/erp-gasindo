import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchSalesParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   location: parseAsString,
   buyer: parseAsString,
   item: parseAsString
};

export const searchSaleParamsCache = createSearchParamsCache(searchSalesParams);
export const serialize = createSerializer(searchSalesParams);
