'use client'


import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { SITE_NAME, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";

export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setEmail("");
            } else {
                toast.error(data.error || "Failed to subscribe");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const socials = [
        { icon: Facebook, href: SOCIAL_LINKS.facebook },
        { icon: Twitter, href: SOCIAL_LINKS.twitter },
        { icon: Instagram, href: SOCIAL_LINKS.instagram },
        { icon: Linkedin, href: SOCIAL_LINKS.linkedin },
    ];

    const footerNav = [
        { title: "Properties", links: [{ label: "All Properties", href: "/properties" }, { label: "Featured", href: "/properties" }, { label: "Sell Property", href: "/contact" }] },
        { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Our Team", href: "/about#team" }, { label: "Contact", href: "/contact" }] },
        { title: "Support", links: [{ label: "Help Center", href: "/contact" }, { label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }] }
    ];

    return (
        <footer className="w-full border-t border-border bg-gray-50 dark:bg-black text-gray-600 dark:text-gray-400">
            <div className="container mx-auto px-4 py-16 md:px-6">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6">
                        <span className="text-2xl font-bold tracking-tight text-primary-dark dark:text-white">{SITE_NAME}</span>
                        <p className="text-sm leading-relaxed max-w-xs">
                            The definitive destination for premium property across the globe. We connect exceptional people with exceptional homes.
                        </p>
                        <div className="flex gap-4">
                            {socials.map((social, i) => (
                                <Link key={i} href={social.href} className="bg-white dark:bg-neutral-900 p-2 rounded-full border border-gray-200 dark:border-neutral-800 hover:text-accent hover:border-accent transition-all">
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {footerNav.map((section, index) => (
                        <div key={index}>
                            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-primary-dark dark:text-white">{section.title}</h3>
                            <ul className="space-y-4 text-sm">
                                {section.links.map((link, i) => (
                                    <li key={i}><Link href={link.href} className="hover:text-accent transition-colors">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-primary-dark dark:text-white">Newsletter</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Subscribe to receive updates on new listings and real estate news.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full bg-gray-100 dark:bg-neutral-900 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-accent outline-hidden"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-1 top-1 bottom-1 px-4 rounded-lg bg-accent hover:bg-accent/90 text-white min-w-[80px]"
                                >
                                    {loading ? "..." : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-200 dark:border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-center text-xs">
                            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
                        </p>
                        <p className="text-xs font-semibold text-accent">RERA: {CONTACT_INFO.rera}</p>
                    </div>
                    <div className="flex gap-6 text-xs">
                        <Link href="/privacy" className="hover:text-accent">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-accent">Terms of Service</Link>
                        <Link href="/contact" className="hover:text-accent">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
