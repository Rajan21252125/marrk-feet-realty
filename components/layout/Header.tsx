'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

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

    return (
        <header
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-black/90 border-b border-gray-200 dark:border-gray-800 py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 z-50">
                    <span className={`text-2xl font-bold tracking-tight transition-colors text-primary`}>
                        Markfeet Realty
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
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
                    className="md:hidden z-50 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className={`h-6 w-6 ${isScrolled ? 'text-black dark:text-white' : 'text-white'}`} />
                    ) : (
                        <Menu className={`h-6 w-6 ${isScrolled ? 'text-black dark:text-white' : 'text-white'}`} />
                    )}
                </button>

                {/* Mobile Nav Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center space-y-8 md:hidden">
                        <Link
                            href="/properties"
                            className="text-2xl font-bold text-white hover:text-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Listings
                        </Link>
                        <Link
                            href="/about"
                            className="text-2xl font-bold text-white hover:text-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button
                                variant="default"
                                size="lg"
                                className="bg-accent hover:bg-accent/90 text-white mt-4 w-full"
                            >
                                Get In Touch
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
