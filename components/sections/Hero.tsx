'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, ChevronDown, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { OptionGroup } from "@/components/ui/OptionGroup";

export function Hero() {
    const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        const query = new URLSearchParams();
        if (location) query.append('location', location);
        if (budget) query.append('budget', budget);
        query.append('type', activeTab);
        router.push(`/properties?${query.toString()}`);
    };

    const popularLocalities = ["Mira Road", "Bhayandar", "Borivali", "Andheri"];

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Image with Navy Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570160813944-24711bc93902?q=80&w=2070&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-brand-navy/80 backdrop-blur-[2px]"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
                {/* RERA Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 animate-fade-in">
                    <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                    <span className="text-white/90 text-xs font-bold tracking-widest uppercase">
                        RERA Registered: A51700044832
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
                    Find Your Dream <br />
                    <span className="text-brand-orange">Home in Mumbai</span>
                </h1>

                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                    From Andheri to Virar, we bring you the best properties across Mumbai's Western Line. Go it 🏠 For it.
                </p>

                {/* Search Card */}
                <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-black/40 p-1.5 md:p-2.5 mb-10 border border-white/20">
                    {/* Tabs */}
                    <div className="flex mb-4 px-2 pt-2" role="tablist">
                        <button
                            onClick={() => setActiveTab('buy')}
                            role="tab"
                            aria-selected={activeTab === 'buy'}
                            className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 rounded-2xl ${activeTab === 'buy'
                                ? 'text-brand-orange-text bg-brand-orange/5 shadow-inner'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Building2 size={18} />
                            Buy
                        </button>
                        <button
                            onClick={() => setActiveTab('rent')}
                            role="tab"
                            aria-selected={activeTab === 'rent'}
                            className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 rounded-2xl ${activeTab === 'rent'
                                ? 'text-brand-orange-text bg-brand-orange/5 shadow-inner'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Building2 size={18} />
                            Rent
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2" role="search">
                        <Select
                            id="hero-location"
                            icon={MapPin}
                            className="bg-white dark:bg-white border-gray-200 dark:border-gray-200 text-brand-navy dark:text-brand-navy py-4 h-full"
                            containerClassName="h-[64px]"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">All Locations</option>
                            {popularLocalities.map(loc => <option key={loc} value={loc.toLowerCase()}>{loc}</option>)}
                        </Select>

                        <Select
                            id="hero-budget"
                            icon={IndianRupee}
                            className="bg-white dark:bg-white border-gray-200 dark:border-gray-200 text-brand-navy dark:text-brand-navy py-4 h-full"
                            containerClassName="h-[64px]"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        >
                            <option value="">Any Budget</option>
                            {activeTab === 'buy' ? (
                                <>
                                    <option value="50">Under 50 Lac</option>
                                    <option value="100">50 Lac - 1 Cr</option>
                                    <option value="200">1 Cr - 2 Cr</option>
                                    <option value="500">2 Cr+</option>
                                </>
                            ) : (
                                <>
                                    <option value="15">Under 15k</option>
                                    <option value="25">15k - 25k</option>
                                    <option value="50">25k - 50k</option>
                                    <option value="100">50k - 1 Lakh</option>
                                    <option value="1000">1 Lakh+</option>
                                </>
                            )}
                        </Select>

                        <Button
                            className="w-full h-full min-h-[64px] bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-brand-orange/30 group transition-all duration-300 active:scale-[0.98]"
                            onClick={handleSearch}
                        >
                            <Search size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                            Search
                        </Button>
                    </div>
                </div>

                {/* Popular Links */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs pb-4">
                    <span className="text-gray-400 font-bold uppercase tracking-widest mr-2">Popular:</span>
                    {popularLocalities.map(locality => (
                        <button
                            key={locality}
                            onClick={() => router.push(`/properties?location=${locality.toLowerCase()}`)}
                            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white/80 font-bold border border-white/10 transition-all hover:text-brand-orange hover:border-brand-orange/40 hover:-translate-y-0.5"
                        >
                            {locality}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex">
                <div className="w-[30px] h-[50px] border-2 border-white/20 rounded-full flex justify-center p-2">
                    <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" />
                </div>
            </div> */}
        </section>
    );
}
