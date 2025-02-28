import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchLocationParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   type: parseAsString
};

export const searchLocationParamsCache =
   createSearchParamsCache(searchLocationParams);
export const serialize = createSerializer(searchLocationParams);
