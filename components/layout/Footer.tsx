'use client'

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { SITE_NAME, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

export function Footer() {
    return (
        <footer className="w-full bg-brand-navy text-gray-300 py-20 border-t border-white/5 relative overflow-hidden">
            {/* Decorative background gradient */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-brand-orange/50 to-transparent opacity-30" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-3 group" aria-label="Go to home page">
                            <Image
                                src="/logo.png"
                                alt="MarkFeet Realty Logo"
                                width={48}
                                height={48}
                                className="object-contain transition-transform group-hover:scale-110"
                            />
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter text-white leading-none">
                                    MarkFeet
                                </span>
                                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-brand-orange-text">
                                    Realty
                                </span>
                            </div>
                        </Link>
                        <div className="space-y-4">
                            <p className="text-sm leading-relaxed text-gray-400 font-medium">
                                Your premium real estate partner in Mumbai. Delivering excellence in every square foot. <br />
                                <span className="inline-block mt-4 text-xs font-bold text-brand-orange-text uppercase tracking-widest bg-brand-orange/5 px-3 py-1 rounded-full border border-brand-orange/10">
                                    RERA Approved: {CONTACT_INFO.rera}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {[
                                { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
                                { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
                                { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
                                { icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Follow us on ${social.label}`}
                                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange text-white transition-all duration-300 group shadow-lg"
                                >
                                    <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                            Quick Links
                            <div className="w-8 h-px bg-brand-orange" />
                        </h3>
                        <ul className="space-y-4 text-sm font-bold">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Properties", href: "/properties" },
                                { label: "About Us", href: "/about" },
                                { label: "Services", href: "/services" },
                                { label: "Contact", href: "/contact" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-400 hover:text-brand-orange transition-all duration-300 flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                            Services
                            <div className="w-8 h-px bg-brand-orange" />
                        </h3>
                        <ul className="space-y-4 text-sm font-bold">
                            {[
                                "Property Buying",
                                "Property Selling",
                                "Rental Services",
                                "Home Loans",
                                "Legal Assistance",
                                "Vastu Consultation"
                            ].map((service, i) => (
                                <li key={i}>
                                    <span className="text-gray-400 hover:text-brand-orange transition-all duration-300 flex items-center gap-2 group cursor-pointer">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                            Contact Info
                            <div className="w-8 h-px bg-brand-orange" />
                        </h3>
                        <ul className="space-y-6 text-sm font-bold">
                            <li className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                    <Phone size={18} />
                                </div>
                                <a href={`tel:${CONTACT_INFO.phone}`} className="text-gray-400 hover:text-brand-orange transition-colors pt-2">
                                    +91 {CONTACT_INFO.phone}
                                </a>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                    <Mail size={18} />
                                </div>
                                <div className="space-y-1 pt-2">
                                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-400 hover:text-brand-orange transition-colors block break-all">
                                        {CONTACT_INFO.email}
                                    </a>
                                    <a href={`mailto:${CONTACT_INFO.supportEmail}`} className="text-gray-500 hover:text-brand-orange transition-colors block break-all text-[11px]">
                                        {CONTACT_INFO.supportEmail}
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                    <MapPin size={18} />
                                </div>
                                <span className="text-gray-400 pt-2 leading-relaxed">
                                    Mira Road East, Mumbai,<br /> Maharashtra 401107
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        © {new Date().getFullYear()} MarkFeet Realty. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange bg-brand-orange/5 px-4 py-2 rounded-full border border-brand-orange/10">
                            Maharera: {CONTACT_INFO.rera}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
