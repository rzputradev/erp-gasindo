import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchBaseParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString
};

export const searchBaseParamsCache = createSearchParamsCache(searchBaseParams);
export const serialize = createSerializer(searchBaseParams);
