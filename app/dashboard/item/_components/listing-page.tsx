import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Table } from './tables';
import { db } from '@/lib/db';
import { Item, Prisma } from '@prisma/client';
import { searchItemParamsCache } from '@/lib/params/item';

export async function ListingPage() {
   const page = searchItemParamsCache.get('page');
   const search = searchItemParamsCache.get('q');
   const pageLimit = searchItemParamsCache.get('limit');
   const itemType = searchItemParamsCache.get('itemType');
   const itemTypeArray = itemType ? (itemType.split('.') as string[]) : [];

   const filters: Prisma.ItemFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [
               { name: { contains: search, mode: 'insensitive' } },
               { key: { contains: search, mode: 'insensitive' } }
            ]
         }),
         ...(itemTypeArray.length > 0 && {
            typeId: {
               in: itemTypeArray
            }
         })
      },
      include: { itemType: true },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.item.findMany(filters),
      db.item.count({ where: filters.where })
   ]);
   const datas: Item[] = data;

   const itemTypes = await db.itemType.findMany();

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Item (${totalData})`}
                  description="Kelola item"
               />
               <Link
                  href={'/dashboard/item/create'}
                  className={cn(buttonVariants({ variant: 'default' }))}
               >
                  <Plus className="mr-2 h-4 w-4" /> Tambah
               </Link>
            </div>
            <Separator />
            <Table data={datas} totalData={totalData} itemTypes={itemTypes} />
         </div>
      </PageContainer>
   );
}
