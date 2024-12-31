import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/constants/data';
import { fakeUsers } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import UserTable from './user-tables';
import { db } from '@/lib/db';
import { Prisma, User } from '@prisma/client';

type TEmployeeListingPage = {};

export default async function UserListingPage({ }: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const gender = searchParamsCache.get('gender');
  const genderArray = gender ? gender.split(".") as any : [];

  const filters: Prisma.UserFindManyArgs = {
    skip: (page - 1) * pageLimit,
    take: pageLimit,
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(genderArray.length > 0 && {
        gender: {
          in: genderArray,
        },
      }),
    },
  };

  const [data, totalUsers] = await Promise.all([
    db.user.findMany(filters),
    db.user.count({ where: filters.where }),
  ]);
  const users: User[] = data;

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Pengguna (${totalUsers})`}
            description="Kelola data pengguna dan hak akses"
          />
          <Link
            href={'/dashboard/user/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Link>
        </div>
        <Separator />
        <UserTable data={users} totalData={totalUsers} />
      </div>
    </PageContainer>
  );
}
