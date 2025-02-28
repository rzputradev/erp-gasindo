import { Prisma } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

import { db } from '@/lib/db';
import { searchIncomingParamsCache } from '@/lib/params/incoming';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';
import { checkPermissions, currentUser } from '@/data/user';
import { unauthorized } from 'next/navigation';
import { Report } from './report';

export async function ListingPage() {
   const user = await currentUser();
   const today = new Date();
   const multiLocationAccess = await checkPermissions(user, [
      'incoming:multi-location'
   ]);
   const fullAccess = await checkPermissions(user, ['incoming:full-access']);

   if (!user) return unauthorized();

   const page = searchIncomingParamsCache.get('page') || 1;
   const search = searchIncomingParamsCache.get('q');
   const pageLimit = searchIncomingParamsCache.get('limit') || 10;
   const locations =
      searchIncomingParamsCache.get('location')?.split('.') || [];
   const suppliers =
      searchIncomingParamsCache.get('supplier')?.split('.') || [];
   const items = searchIncomingParamsCache.get('item')?.split('.') || [];
   const dateRange = searchIncomingParamsCache.get('dateRange');

   // If user lacks multi-location access and `user.location` is undefined, return empty data
   if (!multiLocationAccess && !user.location) {
      return <DataTable columns={columns} data={[]} totalItems={0} />;
   }

   const where: Prisma.IncomingScaleWhereInput = {
      ...(search && {
         ticketNo: { contains: search, mode: 'insensitive' as Prisma.QueryMode }
      }),
      AND: [
         ...(locations.length > 0 && multiLocationAccess
            ? [{ item: { locationId: { in: locations } } }]
            : []),
         ...(suppliers.length > 0
            ? [{ item: { supplierId: { in: suppliers } } }]
            : []),
         ...(items.length > 0 ? [{ item: { itemId: { in: items } } }] : []),
         ...(search
            ? []
            : dateRange?.from && dateRange.to
              ? [
                   {
                      createdAt: {
                         gte: startOfDay(dateRange.from),
                         lte: endOfDay(dateRange.to)
                      }
                   }
                ]
              : [
                   {
                      OR: [
                         { createdAt: { gte: startOfDay(today) } },
                         { exitTime: null }
                      ]
                   }
                ]),
         ...(!multiLocationAccess && user.location
            ? [{ item: { location: { key: user.location } } }]
            : [])
      ]
   };

   const filters: Prisma.IncomingScaleFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where,
      include: {
         item: {
            include: {
               location: true,
               supplier: true,
               item: true
            }
         }
      },
      orderBy: [
         search
            ? { ticketNo: 'asc' }
            : {
                 exitTime: {
                    sort: 'desc',
                    nulls:
                       dateRange?.from && dateRange?.to ? undefined : 'first'
                 }
              },
         { entryTime: 'desc' }
      ]
   };

   const [data, totalData] = await Promise.all([
      db.incomingScale.findMany(filters),
      db.incomingScale.count({ where })
   ]);

   return (
      <>
         <div className="relative">
            <Report data={data as any} fullAccess={fullAccess} />
         </div>

         <DataTable columns={columns} data={data} totalItems={totalData} />
      </>
   );
}
