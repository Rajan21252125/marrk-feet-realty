import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-gray-50 dark:bg-black text-gray-600 dark:text-gray-400">
            <div className="container mx-auto px-4 py-16 md:px-6">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6">
                        <span className="text-2xl font-bold tracking-tight text-primary-dark dark:text-white">Markfeet Realty</span>
                        <p className="text-sm leading-relaxed max-w-xs">
                            The definitive destination for premium property across the globe. We connect exceptional people with exceptional homes.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="bg-white dark:bg-neutral-900 p-2 rounded-full border border-gray-200 dark:border-neutral-800 hover:text-accent hover:border-accent transition-all">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-primary-dark dark:text-white">Properties</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-accent transition-colors">Buy Property</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Rent Property</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Selling Guidance</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Commercial</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-primary-dark dark:text-white">Company</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Our Team</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-primary-dark dark:text-white">Newsletter</h3>
                        <p className="text-sm mb-4">Subscribe to get the latest property updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent"
                            />
                            <button className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-200 dark:border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-center text-xs">
                        © {new Date().getFullYear()} Markfeet Realty. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs">
                        <Link href="#" className="hover:text-accent">Privacy Policy</Link>
                        <Link href="#" className="hover:text-accent">Terms of Service</Link>
                        <Link href="#" className="hover:text-accent">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
