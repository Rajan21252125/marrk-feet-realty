import { Metadata } from 'next';
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Listings } from "@/components/sections/Listings";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
    title: 'Home',
    description: 'Discover premium residential and commercial properties in Mumbai. MarrkFeet Realty offers expert guidance for buying, selling, and renting real estate along the Western Line.',
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
