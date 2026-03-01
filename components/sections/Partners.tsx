'use client';

import Image from 'next/image';

const PARTNERS = [
    { name: 'Partner 1', logo: '/img/partner-1.jpeg' },
    { name: 'Partner 2', logo: '/img/partner-2.jpeg' },
    { name: 'Partner 3', logo: '/img/partner-3.jpeg' },
    { name: 'Partner 4', logo: '/img/partner-4.jpeg' },
    { name: 'Partner 5', logo: '/img/partner-5.jpeg' },
    { name: 'Partner 6', logo: '/img/partner-6.jpeg' },
    { name: 'Partner 7', logo: '/img/partner-7.jpeg' },
    { name: 'Partner 8', logo: '/img/partner-8.jpeg' },
    { name: 'Partner 9', logo: '/img/partner-9.jpeg' },
    { name: 'Partner 10', logo: '/img/partner-10.jpeg' },
    { name: 'Partner 11', logo: '/img/partner-11.jpeg' },
    { name: 'Partner 12', logo: '/img/partner-12.jpeg' },
];

export function Partners() {
    return (
        <section className="bg-neutral-50 dark:bg-neutral-900 py-12 border-y border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                    Trusted by Industry Leaders
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-12 items-center pause-on-hover">
                    {[...PARTNERS, ...PARTNERS].map((partner, index) => (
                        <div key={`${partner.name}-${index}`} className="relative h-20 w-40 opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 group/partner cursor-pointer">
                            <Image
                                src={partner.logo}
                                alt={partner.name}
                                fill
                                className="object-contain"
                            />
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/partner:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                {partner.name}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-12 items-center ml-12 pause-on-hover">
                    {[...PARTNERS, ...PARTNERS].map((partner, index) => (
                        <div key={`${partner.name}-${index}-duplicate`} className="relative h-20 w-40 opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 group/partner cursor-pointer">
                            <Image
                                src={partner.logo}
                                alt={partner.name}
                                fill
                                className="object-contain"
                            />
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/partner:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                {partner.name}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
