'use client';

import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import './globals.css';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname !== "/auth" && pathname.startsWith("/auth/");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Umami analytics script (currently commented out) */}
        
        <Script
          async
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          /> 
       
      </head>
      <body
        className={`${inter.className} scroll-smooth snap-y snap-mandatory transition-colors duration-300 ease-in-out`}
      >
        <ErrorBoundary>
          {!hideHeaderFooter && <Navbar />}
          <AnimatePresence>{children}</AnimatePresence>
          {!hideHeaderFooter && <Footer />}
        </ErrorBoundary>
      </body>
    </html>
  );
}
