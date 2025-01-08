import {
   createSearchParamsCache,
   createSerializer,
   parseAsInteger,
   parseAsString
} from 'nuqs/server';

export const searchTransporterParams = {
   page: parseAsInteger.withDefault(1),
   limit: parseAsInteger.withDefault(10),
   q: parseAsString,
   location: parseAsString
};

export const searchTransporterParamsCache = createSearchParamsCache(
   searchTransporterParams
);
export const serialize = createSerializer(searchTransporterParams);
