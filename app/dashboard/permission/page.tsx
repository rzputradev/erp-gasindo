import { SearchParams } from 'nuqs/server';
import React from 'react';
import { ListingPage } from './_components/listing-page';
import { searchPermissionParamsCache } from '@/lib/params/permission';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Izin'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchPermissionParamsCache.parse(searchParams);

   return <ListingPage />;
}
