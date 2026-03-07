'use client';

import { FadeIn } from "@/components/ui/FadeIn";
import { SERVICES } from "@/lib/constants";
import { CheckCircle2, Home, Building2, FileText, Camera, Users, Landmark, Search } from "lucide-react";

const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('sourcing')) return Search;
    if (t.includes('marketing')) return Users;
    if (t.includes('video')) return Camera;
    if (t.includes('negotiation')) return Building2;
    if (t.includes('buying')) return Home;
    if (t.includes('agreement')) return FileText;
    if (t.includes('consulting')) return Landmark;
    return CheckCircle2;
};

export default function ServicesPage() {
    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="relative py-24 bg-brand-navy overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <FadeIn direction="down">
                        <span className="text-brand-orange font-bold tracking-[0.3em] text-xs uppercase">Our Expertise</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">Expert Solutions for Every <br /> <span className="text-brand-orange">Realty Need</span></h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            We offer a comprehensive suite of real estate services designed to make your property journey smooth, transparent, and rewarding.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-white dark:bg-brand-navy/20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {SERVICES.map((service, index) => {
                            const Icon = getIcon(service.title);
                            return (
                                <FadeIn key={index} delay={index * 0.1} direction="up">
                                    <div className="group p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-orange/30 transition-all duration-500 hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl h-full flex flex-col">
                                        <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange mb-8 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
                                            <Icon size={32} />
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-4xl font-black text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors">0{index + 1}</span>
                                            <h3 className="text-xl font-bold text-brand-navy dark:text-white group-hover:text-brand-orange transition-colors">{service.title}</h3>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 bg-brand-navy text-white text-center">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Start Your <br /> <span className="text-brand-orange">Property Journey?</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
                            Whether you're looking to buy, sell, or invest, our team of experts is here to guide you every step of the way with honesty and dedication.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/contact" className="px-10 py-5 bg-brand-orange text-white font-bold rounded-2xl hover:bg-brand-orange/90 transition-all shadow-xl shadow-brand-orange/20">
                                Get a Free Consultation
                            </a>
                            <a href="/properties" className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
                                Browse Properties
                            </a>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}
