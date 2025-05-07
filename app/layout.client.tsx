'use client';

import React from 'react';
// import ErrorBoundary from '@/components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
      </head>
      <body className="scroll-smooth snap-y snap-mandatory transition-colors duration-300 ease-in-out">
        {/* <ErrorBoundary> */}
          <Navbar />
          <AnimatePresence>
            {children}
          </AnimatePresence>
          <Footer />
        {/* </ErrorBoundary> */}
      </body>
    </html>
  );
}
