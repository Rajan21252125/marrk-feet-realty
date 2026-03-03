'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SITE_NAME, LEADERSHIP_TEAM, SITE_STATS } from '@/lib/constants';
import { Target, Users, Shield, Award, ChevronRight, Mail } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-brand-navy/5 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-brand-navy overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <FadeIn direction="down">
                        <span className="text-brand-orange font-bold tracking-[0.3em] text-xs uppercase underline underline-offset-8">Our Journey</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mt-8 mb-6">Established <span className="text-brand-orange">Oct 12, 2024</span></h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            A mission to redefine the real estate experience through radical transparency,
                            cinematic property showcases, and unwavering commitment to client success.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 dark:bg-brand-navy/10 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Link href="/" className="hover:text-brand-orange">Home</Link>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-brand-navy dark:text-white">About Us</span>
                    </nav>
                </div>
            </div>

            <section className="py-20 md:py-24 overflow-x-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-12 md:gap-16 lg:grid-cols-2 items-center">
                        <FadeIn direction="left">
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-brand-navy/20">
                                <Image
                                    src="/about-us.png"
                                    alt="Modern Real Estate Office"
                                    width={800}
                                    height={1000}
                                    className="object-cover aspect-4/5"
                                />
                                <div className="absolute inset-0 bg-brand-orange/10 mix-blend-multiply"></div>
                            </div>
                        </FadeIn>

                        <FadeIn direction="right">
                            <div className="space-y-8 pr-1.5">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 rounded-full text-brand-orange text-xs font-bold uppercase tracking-widest">
                                    <Award size={16} /> Since 2024
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold text-brand-navy dark:text-white leading-tight">
                                    Your Premier Partner in  <span className="text-brand-orange underline underline-offset-8 decoration-4">Real Estate Solutions</span>.
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed text-justify">
                                    Welcome to {SITE_NAME}. We are dedicated to providing end-to-end real estate services. Our goal is to exceed your expectations by connecting individuals with their dream properties and building lasting relationships.
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                                    As your premier partner in real estate solutions, we deliver comprehensive, tailored services to meet your unique needs. Together, our founders lead with a vision of innovation, transparency, and excellence.
                                </p>

                                <div className="grid grid-cols-2 gap-8 pt-8">
                                    {SITE_STATS.slice(1, 3).map((stat, i) => (
                                        <div key={i}>
                                            <p className="text-4xl font-black text-brand-orange mb-1">{stat.value}</p>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="py-32 bg-brand-navy text-white relative overflow-hidden">
                {/* Modern background decorations */}
                <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <FadeIn direction="down">
                            <span className="text-brand-orange font-bold tracking-[0.4em] text-xs uppercase bg-brand-orange/10 px-4 py-2 rounded-full mb-6 inline-block">The Leadership Team</span>
                            <h2 className="text-4xl md:text-6xl font-bold mt-4 leading-tight">Visionaries Behind <br /> <span className="text-brand-orange">MarrkFeet Realty</span></h2>
                            <p className="text-gray-400 mt-6 text-lg">Leading with transparency, innovation, and a commitment to excellence in the Mumbai real estate landscape.</p>
                        </FadeIn>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
                        {LEADERSHIP_TEAM.map((member, index) => (
                            <FadeIn key={index} delay={index * 0.2} direction="up">
                                <div className="group relative overflow-hidden rounded-[2.5rem] bg-linear-to-b from-white/10 to-white/5 border border-white/10 hover:border-brand-orange/50 transition-all duration-500 shadow-2xl">
                                    <div className="flex flex-col md:flex-row h-full">
                                        {/* Image Section - Fixed size/aspect */}
                                        <div className="relative w-full md:w-[240px] h-[280px] md:h-auto shrink-0 overflow-hidden">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-1000"
                                                sizes="(max-width: 768px) 100vw, 240px"
                                                priority={index === 0}
                                            />
                                            {/* Gradient overlay on image */}
                                            <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-transparent to-transparent opacity-60 md:hidden" />
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
                                            <div className="mb-4 md:mb-6">
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors duration-300">
                                                    {member.name}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-0.5 w-6 bg-brand-orange" />
                                                    <p className="text-brand-orange font-black uppercase tracking-[0.2em] text-[10px]">
                                                        {member.role}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-gray-300 text-sm leading-relaxed mb-6 md:mb-8 italic font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                                &quot;{member.description}&quot;
                                            </p>

                                            <div className="flex gap-4 justify-center md:justify-start">
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 group/icon"
                                                    aria-label={`Email ${member.name}`}
                                                >
                                                    <Mail size={16} className="group-hover/icon:scale-110 transition-transform" />
                                                </a>
                                                <a
                                                    href={member.linkedinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 group/icon"
                                                    aria-label={`${member.name} LinkedIn`}
                                                >
                                                    <Users size={16} className="group-hover/icon:scale-110 transition-transform" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative reflection element */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 translate-x-16 -translate-y-16 pointer-events-none group-hover:translate-x-12 transition-transform duration-700" />
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-white dark:bg-brand-navy/10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-8 md:grid-cols-3">
                        <FadeIn delay={0.1}>
                            <div className="p-10 rounded-[3rem] bg-brand-navy/5 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all group h-full">
                                <div className="w-14 h-14 bg-brand-navy/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-brand-navy dark:text-white mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                    <Target size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-4">Our Mission</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                    To revolutionize the real estate landscape in Mumbai by bringing cinematic quality to property viewing and uncompromising transparency to every deal.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div className="p-10 rounded-[3rem] bg-brand-navy/5 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all group h-full">
                                <div className="w-14 h-14 bg-brand-navy/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-brand-navy dark:text-white mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-4">Our Community</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                    Building a trusted ecosystem for buyers, sellers, and developers where everyone wins through honest advice and market-driven insights.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className="p-10 rounded-[3rem] bg-brand-navy/5 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all group h-full">
                                <div className="w-14 h-14 bg-brand-navy/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-brand-navy dark:text-white mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                    <Shield size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-4">Our Integrity</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                    RERA compliance isn&apos;t just a rule for us; it&apos;s our foundation. We ensure every property we list meets the highest standards of legality and trust.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </div>
    );
}
