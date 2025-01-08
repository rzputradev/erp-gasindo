import { SearchParams } from 'nuqs/server';
import React from 'react';
import { ListingPage } from './_components/listing-page';
import { searchItemParamsCache } from '@/lib/params/item';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Item'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchItemParamsCache.parse(searchParams);

   return <ListingPage />;
}
