import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchUserParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   location: parseAsString,
   role: parseAsString
};

export const searchUserParamsCache = createSearchParamsCache(searchUserParams);
export const serialize = createSerializer(searchUserParams);
