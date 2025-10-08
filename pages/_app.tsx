import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { registerServiceWorker, setupNetworkListeners } from '../lib/sw-register';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Register service worker for caching and offline support
    registerServiceWorker();
    
    // Setup network listeners
    setupNetworkListeners();
  }, []);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://player.vidsrc.co" />
        
        {/* Cache control meta tags */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
        
        {/* PWA theme color */}
        <meta name="theme-color" content="#dc2626" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
