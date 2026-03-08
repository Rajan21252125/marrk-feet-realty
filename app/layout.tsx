import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Script from "next/script";

import { SITE_NAME, CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} 🏠 | Real Estate Agency in Mumbai`,
  },
  description: 'MarrkFeet Realty is your premier real estate agency in Mumbai. Buy, rent, or sell properties in Mira Road, Andheri, and across Mumbai. Find your dream home with us!',
  keywords: [
    "Real Estate in Mumbai",
    "MarrkFeet Realty",
    "Buy Property Mumbai",
    "Rent Apartment Mumbai",
    "Real Estate Agency Mumbai",
    "Property Management Mumbai",
    "Mira Road Real Estate",
    "Mumbai Western Line Properties",
    "Real Estate Consultant Mumbai"
  ],
  authors: [{ name: "MarrkFeet Realty" }],
  creator: "MarrkFeet Realty",
  publisher: "MarrkFeet Realty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon/favicon.ico",
        href: "/favicon/favicon.ico",
      },
      {
        url: "/favicon/favicon-96x96.png",
        href: "/favicon/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        url: "/favicon/favicon.svg",
        href: "/favicon/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        href: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    title: `MarrkFeet Realty | Buy & Rent Properties in Mumbai`,
    description: 'Find your dream home in Mumbai with MarrkFeet Realty. Expert guidance for residential and commercial property transactions.',
    url: 'https://marrkfeetrealty.in',
    siteName: SITE_NAME,
    images: [
      {
        url: '/icon.png',
        width: 800,
        height: 600,
        alt: 'MarrkFeet Realty Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `MarrkFeet Realty | Real Estate Mumbai`,
    description: 'Expert property consulting and management in Mumbai.',
    images: ['/icon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": SITE_NAME,
              "url": "https://marrkfeetrealty.in",
              "logo": "https://marrkfeetrealty.in/icon.png",
              "image": "https://marrkfeetrealty.in/icon.png",
              "description": "MarrkFeet Realty is a premier real estate agency in Mumbai, specializing in residential and commercial properties.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": CONTACT_INFO.address.line1,
                "addressLocality": CONTACT_INFO.address.city,
                "addressRegion": CONTACT_INFO.address.state,
                "postalCode": "401107",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "19.2812",
                "longitude": "72.8550"
              },
              "telephone": CONTACT_INFO.phone,
              "email": CONTACT_INFO.email,
              "priceRange": "$$",
              "sameAs": Object.values(SOCIAL_LINKS)
            })
          }}
        />

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VZKPHY4MZ6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VZKPHY4MZ6');
          `}
        </Script>

        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <a href="#main-content" className="skip-link">Skip to Main Content</a>
            <main id="main-content">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
