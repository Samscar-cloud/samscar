import type { Metadata } from 'next'
import { Montserrat, Geist } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { MobileStickyCTA } from '@/components/MobileStickyCTA'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

export const metadata = {
  title: "Sam's Cars Hotton — Garage & Réparation Auto",
  description: 'Garage automobile à Hotton, Belgique. Réparation, entretien, prise de RDV en ligne.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://samscarage.be'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "Sam's Cars",
  },
}

export const viewport = {
  themeColor: '#12121a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={cn("bg-carbon-300", "text-gray-100", montserrat.variable, "font-sans", geist.variable)}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sam's Cars" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRepair",
              "name": "Sam's cars Hotton",
              "image": "https://example.com/hero-garage.jpg",
              "@id": "",
              "url": "https://example.com",
              "telephone": process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+32470000000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rue de Barvaux 25A",
                "addressLocality": "Hotton",
                "postalCode": "6990",
                "addressCountry": "BE"
              },
              "priceRange": "$$",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "08:00",
                "closes": "18:00"
              }
            })
          }}
        />
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`,
            }}
          />
        )}
      </head>
      <body className={`${montserrat.className} bg-carbon-300 text-gray-100 antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <MobileStickyCTA />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}