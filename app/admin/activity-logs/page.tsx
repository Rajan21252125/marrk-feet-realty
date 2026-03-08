'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface ILog {
    _id: string;
    level: string;
    message: string | unknown;
    timestamp: string;
}


export default function LogsPage() {
    const [logs, setLogs] = useState<ILog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterLevel, setFilterLevel] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [clearing, setClearing] = useState(false);
    const SUPER_ADMIN = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/logs?page=${page}&limit=50&level=${filterLevel}`);
            const data = await res.json();
            if (res.ok) {
                setLogs(data.logs);
                setTotalPages(data.pagination.pages);
            }
        } catch (_error) {
            console.error('Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    const handleClearLogs = async () => {
        if (!confirm('Are you sure you want to clear all system logs? This action cannot be undone.')) {
            return;
        }

        setClearing(true);
        try {
            const res = await fetch('/api/admin/logs', { method: 'DELETE' });
            if (res.ok) {
                setLogs([]);
                setTotalPages(1);
                setPage(1);
                toast.success('All logs cleared successfully');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to clear logs');
            }
        } catch (_error) {
            console.error('Failed to clear logs');
            toast.error('Something went wrong');
        } finally {
            setClearing(false);
        }
    };

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            fetchLogs();
        }
    }, [page, filterLevel, status]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!session || session.user?.email !== SUPER_ADMIN) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="p-4 bg-red-500/10 rounded-full">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">Access Denied</h1>
                <p className="text-gray-400 max-w-md">
                    You do not have permission to view system logs. This area is restricted to authorized administrators only.
                </p>
            </div>
        );
    }

    const getLevelBadge = (level: string) => {
        switch (level) {
            case 'error':
                return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20 uppercase">{level}</span>;
            case 'warn':
                return <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 uppercase">{level}</span>;
            default:
                return <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/20 uppercase">{level}</span>;
        }
    };

    const getRowColor = (level: string) => {
        switch (level) {
            case 'error':
                return 'bg-red-950/20 hover:bg-red-950/30 border-l-2 border-l-red-500';
            case 'warn':
                return 'bg-yellow-950/10 hover:bg-yellow-950/20 border-l-2 border-l-yellow-500';
            default:
                return 'bg-white/5 hover:bg-white/10 border-l-2 border-l-transparent';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
                    <p className="text-gray-400">Monitor application activity and errors</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={filterLevel}
                        onChange={(e) => { setFilterLevel(e.target.value); setPage(1); }}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                        <option value="all">All Levels</option>
                        <option value="info">Info</option>
                        <option value="warn">Warn</option>
                        <option value="error">Error</option>
                    </select>
                    <Button
                        onClick={handleClearLogs}
                        variant="ghost"
                        size="sm"
                        disabled={loading || clearing || logs.length === 0}
                        className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Logs
                    </Button>
                    <Button onClick={fetchLogs} variant="outline" size="sm" className="gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="bg-primary/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                                <th className="p-4 w-48">Timestamp</th>
                                <th className="p-4 w-24">Level</th>
                                <th className="p-4">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-sm">
                            {logs.map((log) => (
                                <tr key={log._id} className={`transition-colors ${getRowColor(log.level)}`}>
                                    <td className="p-4 text-gray-400 whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        {getLevelBadge(log.level)}
                                    </td>
                                    <td className="p-4 text-gray-200 break-all">
                                        {typeof log.message === 'string' ? log.message : JSON.stringify(log.message)}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-500">
                                        No logs found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
