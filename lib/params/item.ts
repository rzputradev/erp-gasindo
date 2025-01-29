import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchItemParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   category: parseAsString
};

export const searchItemParamsCache = createSearchParamsCache(searchItemParams);
export const serialize = createSerializer(searchItemParams);
