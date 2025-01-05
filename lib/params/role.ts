import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchRoleParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString
};

export const searchRoleParamsCache = createSearchParamsCache(searchRoleParams);
export const serialize = createSerializer(searchRoleParams);
