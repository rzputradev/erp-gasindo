import { SearchParams } from 'nuqs/server';
import React from 'react';
import { ListingPage } from './_components/listing-page';
import { searchBaseParamsCache } from '@/lib/params/base';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Tipe Item'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchBaseParamsCache.parse(searchParams);

   return <ListingPage />;
}
