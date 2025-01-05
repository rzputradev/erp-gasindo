import { SearchParams } from 'nuqs/server';
import React from 'react';
import { ListingPage } from './_components/listing-page';
import { searchLocationParamsCache } from '@/lib/params/location';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Pengguna'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;

   searchLocationParamsCache.parse(searchParams);

   return <ListingPage />;
}
