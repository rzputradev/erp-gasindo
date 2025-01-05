import { SearchParams } from 'nuqs/server';
import React from 'react';
import { ListingPage } from './_components/listing-page';
import { searchRoleParamsCache } from '@/lib/params/role';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Role'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchRoleParamsCache.parse(searchParams);

   return <ListingPage />;
}
