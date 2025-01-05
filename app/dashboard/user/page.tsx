import { SearchParams } from 'nuqs/server';
import React from 'react';
import { ListingPage } from './_components/listing-page';
import { searchUserParamsCache } from '@/lib/params/user';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : User'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchUserParamsCache.parse(searchParams);

   return <ListingPage />;
}
