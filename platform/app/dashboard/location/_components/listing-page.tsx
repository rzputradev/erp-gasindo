import { LocationType, Prisma } from '@prisma/client';

import { db } from '@/lib/db';
import { searchLocationParamsCache } from '@/lib/params/location';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './tables/columns';

type LocationListingPage = {};

export async function ListingPage({}: LocationListingPage) {
   const page = searchLocationParamsCache.get('page');
   const search = searchLocationParamsCache.get('q');
   const pageLimit = searchLocationParamsCache.get('limit');
   const type = searchLocationParamsCache.get('type');
   const typeArray = type ? (type.split('.') as LocationType[]) : [];

   const filters: Prisma.LocationFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [{ name: { contains: search, mode: 'insensitive' } }]
         }),
         ...(typeArray.length > 0 && {
            type: {
               in: typeArray
            }
         })
      },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.location.findMany(filters),
      db.location.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
