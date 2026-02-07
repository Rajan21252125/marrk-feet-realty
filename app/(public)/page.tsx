import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Listings } from "@/components/sections/Listings";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
    return (
        <>
            <Hero />
            <Partners />
            <Listings />
            <Testimonials />
            <Contact />
        </>
    );
}
