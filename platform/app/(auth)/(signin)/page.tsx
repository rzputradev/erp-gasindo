import { Metadata } from 'next';
import SignInViewPage from '../_components/sigin-view';

export const metadata: Metadata = {
   title: 'PT. Garuda Sakti Nusantara Indonesia',
   description: 'Sign In page for authentication.'
};

export default function Page() {
   return <SignInViewPage />;
}
