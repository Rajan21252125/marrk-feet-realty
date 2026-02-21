import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Home, Search } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Logo Section */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                    <Image
                        src="/logo.png"
                        alt={SITE_NAME}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                    <h1 className="text-9xl font-extrabold text-accent/20 dark:text-accent/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
                        404
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-dark dark:text-white">
                        Lost in the Luxury?
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        We couldn't find the property or page you're looking for. It might have been moved or doesn't exist anymore.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Link href="/">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 rounded-xl shadow-lg shadow-accent/20 flex items-center gap-2">
                            <Home className="h-5 w-5" />
                            Return Home
                        </Button>
                    </Link>
                    <Link href="/properties">
                        <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 px-8 rounded-xl flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Browse Listings
                        </Button>
                    </Link>
                </div>

                {/* Branding Footer */}
                <p className="text-sm text-gray-400 font-medium pt-12">
                    © {new Date().getFullYear()} {SITE_NAME}. Excellence in Every Square Foot.
                </p>
            </div>
        </div>
    );
}
