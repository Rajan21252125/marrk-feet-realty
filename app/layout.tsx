import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import { SITE_NAME } from "@/lib/constants";

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
  icons: {
    icon: [
      {
        url: "/title-logo.png",
        href: "/title-logo.png",
      },
    ],
    shortcut: "/title-logo.png",
    apple: [
      {
        url: "/title-logo.png",
        href: "/title-logo.png",
      },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/title-logo.png',
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
