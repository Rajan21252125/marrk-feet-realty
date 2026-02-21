'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SITE_NAME, LEADERSHIP_TEAM, TEAM_STRUCTURE, SERVICES } from '@/lib/constants';
import { ShieldCheck, Video, Users, TrendingUp, Handshake, FileText, Search } from 'lucide-react';

export default function AboutPage() {
    const [stats, setStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            if (res.ok) {
                setStats([
                    { label: 'Happy Clients', value: `${data.happyClients}+` },
                    { label: 'Properties Sold', value: `${data.propertiesSold}+` },
                    { label: 'Active Listings', value: `${data.activeListings}` },
                    { label: 'Years of Experience', value: '1+' }, // Or calculate from constants if needed
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoadingStats(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden aspect-4/5">
                <Image
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop"
                    alt="About Us"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">Established Oct 12, 2024</h1>
                        <p className="text-xl md:text-2xl font-light text-gray-200">
                            Revolutionizing the real estate experience through innovation and dedication.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-b border-gray-100 dark:border-white/10 pb-12">
                    {loadingStats ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="flex flex-col items-center animate-pulse">
                                <div className="h-10 w-24 bg-gray-200 dark:bg-neutral-800 rounded mb-2"></div>
                                <div className="h-4 w-32 bg-gray-100 dark:bg-neutral-900 rounded"></div>
                            </div>
                        ))
                    ) : (
                        stats?.map((stat: any, index: number) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</p>
                                <p className="text-sm md:text-base text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Story & Vision */}
                <div className="grid gap-16 lg:grid-cols-2 items-center mb-24">
                    <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl group">
                        <Image
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop"
                            alt="Our Story"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-white">
                            Your partner in real estate solutions.
                        </h2>
                        <div className="w-20 h-1 bg-accent rounded-full"></div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            Welcome to {SITE_NAME}. We are dedicated to providing end-to-end real estate services. Our goal is to exceed your expectations by connecting individuals with their dream properties and building lasting relationships.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            As your premier partner in real estate solutions, we deliver comprehensive, tailored services to meet your unique needs. Together, our founders lead with a vision of innovation, transparency, and excellence.
                        </p>
                    </div>
                </div>

                {/* Leadership Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-white mb-4">Founded by Visionaries</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Excellence in real estate through innovation and transparency.
                        </p>
                    </div>

                    <div className="grid gap-12 sm:grid-cols-2 max-w-5xl mx-auto">
                        {LEADERSHIP_TEAM.map((member, index) => (
                            <div key={index} className="flex flex-col items-center text-center space-y-4">
                                <div className="relative w-64 h-80 overflow-hidden rounded-2xl shadow-xl mb-4 group aspect-4/5">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-0 w-full px-4 text-white">
                                        <h3 className="text-xl font-bold">{member.name}</h3>
                                        <p className="text-accent text-sm font-medium">{member.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Structure */}
                <div className="mb-24 bg-gray-50 dark:bg-neutral-900/50 p-12 rounded-3xl border border-gray-100 dark:border-white/5">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-white mb-4">Our Comprehensive Team Structure</h2>
                        <p className="text-gray-600 dark:text-gray-300">Dedicated professionals at every step of your journey.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 text-center">
                            <h3 className="text-xl font-bold text-accent mb-6 flex items-center justify-center gap-2">
                                <TrendingUp className="h-5 w-5" /> Sourcing Team
                            </h3>
                            <ul className="space-y-3">
                                {TEAM_STRUCTURE.sourcing.map((member, i) => (
                                    <li key={i} className="text-lg text-gray-700 dark:text-gray-300 font-medium">{member.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 text-center">
                            <h3 className="text-xl font-bold text-accent mb-6 flex items-center justify-center gap-2">
                                <Handshake className="h-5 w-5" /> Closing Team
                            </h3>
                            <ul className="space-y-3">
                                {TEAM_STRUCTURE.closing.map((member, i) => (
                                    <li key={i} className="text-lg text-gray-700 dark:text-gray-300 font-medium">{member.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 text-center">
                            <h3 className="text-xl font-bold text-accent mb-6 flex items-center justify-center gap-2">
                                <Video className="h-5 w-5" /> Video Editing Team
                            </h3>
                            <ul className="space-y-3">
                                {TEAM_STRUCTURE.videoEditing.map((member, i) => (
                                    <li key={i} className="text-lg text-gray-700 dark:text-gray-300 font-medium">{member.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-white mb-4">Our End-to-End Real Estate Solutions</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A comprehensive suite of services to meet all your real estate needs.</p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {SERVICES.map((service, index) => (
                            <div key={index} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md hover:border-accent/30 transition-all group">
                                <div className="w-12 h-12 bg-accent/10 rounded-xl text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                                    {index === 0 && <Search className="h-6 w-6" />}
                                    {index === 1 && <TrendingUp className="h-6 w-6" />}
                                    {index === 2 && <Video className="h-6 w-6" />}
                                    {index === 3 && <Handshake className="h-6 w-6" />}
                                    {index === 4 && <Users className="h-6 w-6" />}
                                    {index === 5 && <FileText className="h-6 w-6" />}
                                    {index === 6 && <ShieldCheck className="h-6 w-6" />}
                                </div>
                                <h3 className="text-xl font-bold text-primary-dark dark:text-white mb-3 leading-tight">{service.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
