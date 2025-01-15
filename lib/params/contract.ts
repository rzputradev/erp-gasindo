import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchContractParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   location: parseAsString,
   buyer: parseAsString,
   item: parseAsString
};

export const searchContractParamsCache =
   createSearchParamsCache(searchContractParams);
export const serialize = createSerializer(searchContractParams);
