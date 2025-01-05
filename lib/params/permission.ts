import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchPermissionParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString
};

export const searchPermissionParamsCache = createSearchParamsCache(
   searchPermissionParams
);
export const serialize = createSerializer(searchPermissionParams);
