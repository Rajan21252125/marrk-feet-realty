'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Menu, X, Heart, Phone, Moon, Sun } from "lucide-react";
import { SITE_NAME, CONTACT_INFO } from "@/lib/constants";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const pathname = usePathname();
    const wasMobileMenuOpen = useRef(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll and handle focus/keyboard when mobile menu is open
    useEffect(() => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('mobile-menu');

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }

            if (e.key === 'Tab' && menu) {
                const focusableElements = menu.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);

            // Move focus to first element in menu
            if (menu) {
                const firstElement = menu.querySelector<HTMLElement>('a, button');
                firstElement?.focus();
            }
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
            // Restore focus only if menu was previously open
            if (wasMobileMenuOpen.current) {
                toggleBtn?.focus();
            }
        }

        wasMobileMenuOpen.current = isMobileMenuOpen;

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/properties", label: "Properties" },
        { href: "/about", label: "About" },
        { href: "/services", label: "Services" },
        { href: "/contact", label: "Contact" },
    ];

    if (!mounted) return null;

    return (
        <>
            <header
                className={`fixed top-0 z-100 w-full transition-all duration-300 ${isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm dark:bg-brand-navy/95 border-b border-gray-100 dark:border-white/5"
                    : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group z-110">
                            <Image
                                src="/logo.png"
                                alt="MarrkFeet Realty - Mumbai's Premium Real Estate Agency"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <div className="flex flex-col">
                                <span className={`text-xl font-bold tracking-tight leading-none ${!isScrolled && ['/', '/about', '/services', '/contact'].includes(pathname) ? 'text-white' : 'text-brand-navy dark:text-white'}`}>
                                    MarrkFeet
                                </span>
                                <span className={`text-[10px] font-medium tracking-[0.2em] uppercase text-brand-orange-text`}>
                                    Realty
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-semibold transition-all hover:text-brand-orange relative group ${!isScrolled && ['/', '/about', '/services', '/contact'].includes(pathname)
                                        ? 'text-white/90'
                                        : 'text-gray-700 dark:text-gray-200'
                                        } ${pathname === link.href ? 'text-brand-orange' : ''}`}
                                >
                                    {link.label}
                                    {pathname === link.href && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-orange rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-5">
                            <button
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                className={`p-2 rounded-full transition-colors ${!isScrolled && ['/', '/about', '/services', '/contact'].includes(pathname)
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                                aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                            >
                                {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <Link
                                id="header-favorites-link"
                                href="/favorites"
                                className={`p-2 rounded-full transition-colors ${!isScrolled && ['/', '/about', '/services', '/contact'].includes(pathname)
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                                aria-label="View favorite properties"
                            >
                                <Heart size={20} />
                            </Link>

                            <a
                                href={`tel:${CONTACT_INFO.phone}`}
                                className={`flex items-center gap-2 text-sm font-bold transition-colors ${!isScrolled && ['/', '/about', '/services', '/contact'].includes(pathname)
                                    ? 'text-white/90 hover:text-white'
                                    : 'text-gray-800 dark:text-gray-200 hover:text-brand-orange-text'
                                    }`}
                            >
                                <Phone size={16} className="text-brand-orange-text" />
                                {CONTACT_INFO.phone}
                            </a>

                            <Link href="/contact">
                                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-6 shadow-lg shadow-brand-orange/20">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex lg:hidden items-center gap-4 z-110">
                            <button
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                className={`p-2 ${!isScrolled && ['/', '/about', '/services', '/contact'].includes(pathname) && !isMobileMenuOpen ? 'text-white' : 'text-brand-navy dark:text-white'}`}
                                aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                            >
                                {resolvedTheme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                            </button>
                            <button
                                id="mobile-menu-toggle"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`p-2 ${!isScrolled && ['/', '/about', '/services', '/contact'].includes(pathname) && !isMobileMenuOpen ? 'text-white' : 'text-brand-navy dark:text-white'}`}
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="mobile-menu"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    id="mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation menu"
                    className={`
                    fixed inset-0 z-105 bg-brand-navy dark:bg-black transition-all duration-500 ease-in-out lg:hidden
                    ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                `}>
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-brand-orange/10 to-transparent pointer-events-none" />

                    <div className="flex flex-col h-full pt-32 px-10 pb-12 relative z-10">
                        <nav className="flex flex-col gap-8">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-4xl font-bold tracking-tight transition-all duration-300 hover:text-brand-orange ${pathname === link.href ? 'text-brand-orange translate-x-4' : 'text-white'
                                        }`}
                                    style={{ transitionDelay: `${i * 50}ms` }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto space-y-8">
                            <div className="h-px bg-white/10 w-full" />
                            <div className="space-y-4">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Contact Us</p>
                                <a
                                    href={`tel:${CONTACT_INFO.phone}`}
                                    className="flex items-center gap-4 text-3xl font-bold text-white hover:text-brand-orange transition-colors"
                                >
                                    <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                                        <Phone size={24} />
                                    </div>
                                    {CONTACT_INFO.phone}
                                </a>
                            </div>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full h-16 bg-brand-orange hover:bg-brand-orange/90 text-white text-xl font-bold rounded-2xl shadow-xl shadow-brand-orange/20">
                                    Enquire Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
