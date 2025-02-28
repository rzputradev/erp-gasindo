import { Prisma } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

import { db } from '@/lib/db';
import { searchOutgoingParamsCache } from '@/lib/params/outgoing';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';
import { checkPermissions, currentUser } from '@/data/user';
import { unauthorized } from 'next/navigation';
import { Report } from './report';

export async function ListingPage() {
   const user = await currentUser();
   const today = new Date();
   const multiLocationAccess = await checkPermissions(user, [
      'outgoing:multi-location'
   ]);
   const fullAccess = await checkPermissions(user, ['outgoing:full-access']);

   if (!user) return unauthorized();

   const page = searchOutgoingParamsCache.get('page') || 1;
   const search = searchOutgoingParamsCache.get('q');
   const pageLimit = searchOutgoingParamsCache.get('limit') || 10;
   const locations =
      searchOutgoingParamsCache.get('location')?.split('.') || [];
   const buyers = searchOutgoingParamsCache.get('buyer')?.split('.') || [];
   const items = searchOutgoingParamsCache.get('item')?.split('.') || [];
   const dateRange = searchOutgoingParamsCache.get('dateRange');

   // If user lacks multi-location access and `user.location` is undefined, return empty data
   if (!multiLocationAccess && !user.location) {
      return <DataTable columns={columns} data={[]} totalItems={0} />;
   }

   const where: Prisma.OutgoingScaleWhereInput = {
      ...(search && {
         ticketNo: { contains: search, mode: 'insensitive' as Prisma.QueryMode }
      }),
      AND: [
         ...(locations.length > 0 && multiLocationAccess
            ? [{ order: { contract: { locationId: { in: locations } } } }]
            : []),
         ...(buyers.length > 0
            ? [{ order: { contract: { buyerId: { in: buyers } } } }]
            : []),
         ...(items.length > 0
            ? [{ order: { contract: { itemId: { in: items } } } }]
            : []),
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
            ? [{ order: { contract: { location: { key: user.location } } } }]
            : [])
      ]
   };

   const filters: Prisma.OutgoingScaleFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where,
      include: { order: { include: { contract: true } } },
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
      db.outgoingScale.findMany(filters),
      db.outgoingScale.count({ where })
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
