import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { Hero } from "@/components/sections/Hero";
import dynamic from 'next/dynamic';

const Partners = dynamic(() => import('@/components/sections/Partners').then((mod) => mod.Partners));
const Listings = dynamic(() => import('@/components/sections/Listings').then((mod) => mod.Listings));
const Testimonials = dynamic(() => import('@/components/sections/Testimonials').then((mod) => mod.Testimonials));
const Contact = dynamic(() => import('@/components/sections/Contact').then((mod) => mod.Contact));

export const metadata: Metadata = {
    title: 'Home',
    description: `Discover premium residential and commercial properties in Mumbai. ${SITE_NAME} offers expert guidance for buying, selling, and renting real estate along the Western Line.`,
};

export default function Home() {
    return (
        <div className="flex flex-col">
            <Hero />
            <Partners />
            <Listings />
            <Testimonials />
            <Contact />
        </div>
    );
}
