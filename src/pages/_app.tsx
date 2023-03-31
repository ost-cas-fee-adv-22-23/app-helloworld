import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { Header } from '../components/header';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header></Header>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
