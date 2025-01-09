import { LocationType, Prisma, Transporter } from '@prisma/client';

import { db } from '@/lib/db';
import { searchTransporterParamsCache } from '@/lib/params/transporter';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';

export async function ListingPage() {
   const page = searchTransporterParamsCache.get('page');
   const search = searchTransporterParamsCache.get('q');
   const pageLimit = searchTransporterParamsCache.get('limit');

   const filters: Prisma.TransporterFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [{ name: { contains: search, mode: 'insensitive' } }]
         })
      },
      include: { location: true },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.transporter.findMany(filters),
      db.transporter.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
