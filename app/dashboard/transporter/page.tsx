import { SearchParams } from 'nuqs/server';
import React from 'react';
import { ListingPage } from './_components/listing-page';
import { searchTransporterParamsCache } from '@/lib/params/transporter';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Pengangkutan'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchTransporterParamsCache.parse(searchParams);

   return <ListingPage />;
}
