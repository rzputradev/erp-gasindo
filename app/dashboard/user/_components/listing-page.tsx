import { Prisma, User } from '@prisma/client';

import { searchUserParamsCache } from '@/lib/params/user';
import { db } from '@/lib/db';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';

export async function ListingPage() {
   const page = searchUserParamsCache.get('page');
   const search = searchUserParamsCache.get('q');
   const pageLimit = searchUserParamsCache.get('limit');
   const location = searchUserParamsCache.get('location');
   const locationArray = location ? (location.split('.') as string[]) : [];
   const role = searchUserParamsCache.get('role');
   const roleArray = role ? (role.split('.') as string[]) : [];

   const filters: Prisma.UserFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [
               { name: { contains: search, mode: 'insensitive' } },
               { email: { contains: search, mode: 'insensitive' } }
            ]
         }),
         ...(locationArray.length > 0 && {
            locationId: {
               in: locationArray
            }
         }),
         ...(roleArray.length > 0 && {
            roleId: {
               in: roleArray
            }
         })
      },
      include: {
         role: true,
         location: true
      }
   };

   const [data, totalData] = await Promise.all([
      db.user.findMany(filters),
      db.user.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
