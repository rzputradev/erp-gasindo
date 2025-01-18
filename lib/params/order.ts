import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchOrderParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   location: parseAsString,
   buyer: parseAsString,
   item: parseAsString
};

export const searchOrderParamsCache =
   createSearchParamsCache(searchOrderParams);
export const serialize = createSerializer(searchOrderParams);
