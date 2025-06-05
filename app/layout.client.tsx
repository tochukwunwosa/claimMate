'use client';

import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Inter } from 'next/font/google';
import { jsonLd } from '@/lib/jsonld';
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from 'sonner';


const inter = Inter({ subsets: ['latin'] });

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderFooter = (
  (pathname.startsWith("/auth/") && pathname !== "/auth") ||
  (pathname.startsWith("/dashboard")) || (pathname.startsWith('/onboarding'))
)


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Umami analytics script */}        
        <Script
          async
          defer
          src="https://cloud.umami.is/script.js"
          // data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
          {/* SEO */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
       
      </head>
      <body
        className={`${inter.className} scroll-smooth snap-y snap-mandatory transition-colors duration-300 ease-in-out `}
      >
        <ErrorBoundary>
          {!hideHeaderFooter && <Navbar />}
          <AnimatePresence>
            <UserProvider>

              <Toaster richColors={true} position='top-center'/>
            {children}
            </UserProvider>
          </AnimatePresence>
          {!hideHeaderFooter && <Footer />}
        </ErrorBoundary>
      </body>
    </html>
  );
}
