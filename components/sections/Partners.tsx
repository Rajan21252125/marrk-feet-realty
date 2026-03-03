'use client';

import { FadeIn } from "@/components/ui/FadeIn";
import Image from "next/image";

const PARTNERS = [
    { name: "Apna Ghar", logo: "/img/partner-1.jpeg" },
    { name: "MICL", logo: "/img/partner-2.jpeg" },
    { name: "JP Infra", logo: "/img/partner-3.jpeg" },
    { name: "Lodha", logo: "/img/partner-4.jpeg" },
    { name: "Salasar", logo: "/img/partner-5.jpeg" },
];

export function Partners() {
    return (
        <section className="py-20 bg-brand-navy border-y border-white/5 relative overflow-hidden">
            {/* Gradient Overlays for smooth edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-brand-navy to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-brand-navy to-transparent z-10" />

            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <FadeIn direction="up">
                    <span className="text-brand-orange font-bold tracking-[0.4em] text-[10px] uppercase block mb-4">
                        Trusted By Industry Leaders
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Builders We Work With</h2>
                    <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full" />
                </FadeIn>
            </div>

            <div className="flex overflow-hidden whitespace-nowrap relative z-0">
                <div className="flex animate-marquee hover:[animation-play-state:paused] py-4">
                    {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
                        <div
                            key={i}
                            className="mx-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-center justify-center min-w-[220px] h-32 hover:border-brand-orange/50 transition-all group"
                        >
                            <div className="relative w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    display: flex;
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </section>
    );
}
