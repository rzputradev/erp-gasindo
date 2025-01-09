import { db } from '@/lib/db';
import { Prisma, VehicleType } from '@prisma/client';
import { searchBaseParamsCache } from '@/lib/params/base';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './tables/columns';

export async function ListingPage() {
   const page = searchBaseParamsCache.get('page');
   const search = searchBaseParamsCache.get('q');
   const pageLimit = searchBaseParamsCache.get('limit');

   const filters: Prisma.VehicleTypeFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [{ name: { contains: search, mode: 'insensitive' } }]
         })
      },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.vehicleType.findMany(filters),
      db.vehicleType.count({ where: filters.where })
   ]);
   const datas: VehicleType[] = data;

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
