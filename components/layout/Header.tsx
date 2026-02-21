'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <header
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-black/90 border-b border-gray-200 dark:border-gray-800 py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2 z-50">
                        <span className={`text-2xl font-bold tracking-tight transition-colors text-primary`}>
                            {SITE_NAME}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className={`text-sm font-medium transition-colors hover:text-accent ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white/90'}`}>
                            Home
                        </Link>
                        <Link href="/properties" className={`text-sm font-medium transition-colors hover:text-accent ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white/90'}`}>
                            Listings
                        </Link>
                        <Link href="/about" className={`text-sm font-medium transition-colors hover:text-accent ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white/90'}`}>
                            About
                        </Link>

                        <Link href="/contact">
                            <Button variant="default" className="bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20">
                                Get In Touch
                            </Button>
                        </Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`md:hidden outline-none transition-all duration-300 ${isMobileMenuOpen ? 'fixed right-4 top-5 z-110' : 'relative z-50'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-7 w-7 text-white" />
                        ) : (
                            <Menu className={`h-7 w-7 ${isScrolled ? 'text-black dark:text-white' : 'text-white'}`} />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Nav Overlay - Moved outside header to avoid containing block issues */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-100 bg-black flex flex-col items-center justify-center space-y-8 md:hidden overflow-y-auto">
                    {/* Header in Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between border-b border-white/10">
                        <span className="text-2xl font-bold tracking-tight text-primary">
                            {SITE_NAME}
                        </span>
                        <X onClick={() => setIsMobileMenuOpen(false)} className="h-7 w-7 text-white" />
                    </div>

                    <Link
                        href="/"
                        className="text-3xl font-bold text-white hover:text-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/properties"
                        className="text-3xl font-bold text-white hover:text-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Listings
                    </Link>
                    <Link
                        href="/about"
                        className="text-3xl font-bold text-white hover:text-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        About
                    </Link>
                    <div className="w-full px-8 pt-4">
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button
                                variant="default"
                                size="lg"
                                className="bg-accent hover:bg-accent/90 text-white w-full h-14 text-xl"
                            >
                                Get In Touch
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
