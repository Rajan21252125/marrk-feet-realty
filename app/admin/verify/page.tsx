'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function VerifyPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resending, setResending] = useState(false);

    const resendCode = useCallback(async (isAuto = false) => {
        try {
            setResending(true);
            const res = await fetch('/api/admin/verify/resend', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to send code');

            if (!isAuto) toast.success('New verification code sent!');
        } catch (err) {
            console.error('Error sending code');
            if (!isAuto) toast.error('Failed to send verification code');
        } finally {
            setResending(false);
        }
    }, []);

    useEffect(() => {
        const user = session?.user as { isVerified?: boolean };
        if (status === 'authenticated') {
            if (user?.isVerified) {
                router.push('/admin/dashboard');
            } else {
                // Auto-trigger code generation on mount if not verified
                resendCode(true);
            }
        }
    }, [status, session, router, resendCode]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: session?.user?.email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            toast.success('Account verified!');
            setSuccess(true);

            // Update the session on the client side to reflect the database change
            await update({ isVerified: true });

            setTimeout(() => {
                router.push('/admin/dashboard');
                router.refresh(); // Ensure server components re-render
            }, 1000);

        } catch (_err) {
            setError((_err as Error).message);
            toast.error((_err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') return <div className="flex h-screen items-center justify-center bg-muted/30">Loading...</div>;

    if (status === 'unauthenticated') {
        router.push('/admin/login');
        return null;
    }

    // If already verified (checked in useEffect), render nothing while redirecting
    if ((session?.user as { isVerified?: boolean })?.isVerified) return null;

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-xl transition-all">
                <div className="bg-primary-dark p-8 text-center text-white">
                    <ShieldCheck className="mx-auto mb-4 h-16 w-16 text-primary" />
                    <h1 className="text-3xl font-bold">Identity Verification</h1>
                    <p className="mt-2 text-primary-foreground/80">
                        Please verifying your account to access the admin dashboard.
                    </p>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground">Verified Successfully!</h2>
                            <p className="text-muted-foreground">Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-muted-foreground">Verification Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-center text-2xl font-bold tracking-widest text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="• • • • • •"
                                    maxLength={6}
                                    required
                                />
                                <p className="mt-2 text-xs text-muted-foreground text-center">
                                    Enter the 6-digit code sent to your email (or check server logs in dev).
                                </p>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify Account'}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => resendCode()}
                                    disabled={resending}
                                    className="flex w-full h-12 items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                                >
                                    <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                                    {resending ? 'Sending...' : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary mx-auto"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
