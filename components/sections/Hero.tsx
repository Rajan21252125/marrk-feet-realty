'use client';

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Hero() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push('/properties');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-1000 md:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center md:px-6 pt-20">
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm mb-6 border border-white/10">
                    #1 Premium Real Estate Agency
                </span>

                <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-xl">
                    Discover Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Dream Lifestyle</span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 sm:text-xl font-light leading-relaxed">
                    Access the most exclusive property inventory. From modern penthouses to secluded waterfront estates.
                </p>

                {/* Search Bar */}
                <div className="mx-auto max-w-3xl bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl mb-12 transform hover:scale-[1.01] transition-transform">
                    <div className="flex flex-col md:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Enter location, property type, or keywords..."
                            className="flex-1 bg-transparent border-none text-white placeholder-gray-400 px-6 py-4 focus:ring-0 text-lg outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button
                            size="lg"
                            className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-accent/25"
                            onClick={handleSearch}
                        >
                            Search Properties
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-300 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Trusted by 2,000+ premium buyers</p>
                </div>
            </div>
        </section>
    );
}
