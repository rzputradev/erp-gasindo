import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchOutgoingParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   location: parseAsString,
   supplier: parseAsString,
   item: parseAsString
};

export const searchOutgoingParamsCache =
   createSearchParamsCache(searchOutgoingParams);
export const serialize = createSerializer(searchOutgoingParams);
