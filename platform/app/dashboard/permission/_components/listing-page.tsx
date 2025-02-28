import { DataTable } from '@/components/ui/table/data-table';
import { db } from '@/lib/db';
import { searchBaseParamsCache } from '@/lib/params/base';
import { Prisma } from '@prisma/client';
import { columns } from './tables/columns';

export async function ListingPage() {
   const page = searchBaseParamsCache.get('page');
   const search = searchBaseParamsCache.get('q');
   const pageLimit = searchBaseParamsCache.get('limit');

   const filters: Prisma.PermissionFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [
               { name: { contains: search, mode: 'insensitive' } },
               { key: { contains: search, mode: 'insensitive' } }
            ]
         })
      },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.permission.findMany(filters),
      db.permission.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
