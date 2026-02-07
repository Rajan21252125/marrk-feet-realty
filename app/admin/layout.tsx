'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building, MessageSquare, Settings, LogOut, Menu, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = session?.user;

    useEffect(() => {
        if (status === 'authenticated') {
            if (user && !(user as { isVerified?: boolean }).isVerified && pathname !== '/admin/verify') {
                router.push('/admin/verify');
            }
        }
    }, [status, session, pathname, router, user]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Don't show sidebar on login or verify page
    if (pathname === '/admin/login' || pathname === '/admin/verify') {
        return <>{children}</>;
    }

    const NAV_ITEMS = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/properties', label: 'Properties', icon: Building },
        { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-900 border-b border-white/10 flex items-center justify-between px-4 z-50">
                <span className="text-xl font-bold text-white">MarkFeet Admin</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-300 hover:text-white"
                >
                    {isSidebarOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Kept Dark as per design */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-neutral-900 text-gray-100 border-r border-white/10 shadow-2xl z-50 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:block
            `}>
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        MarkFeet Admin
                    </span>
                </div>

                <div className="p-4">
                    {user && (
                        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                {user.name?.[0] || 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.name || 'Admin'}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}

                    <nav className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-white/10 text-white shadow-sm border border-white/5'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-accent' : 'text-gray-500'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-6 left-0 w-full px-4">
                    <Button
                        variant="ghost"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center gap-3 justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full lg:w-auto min-h-screen pt-16 lg:pt-0 overflow-x-hidden bg-background text-foreground">
                <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
