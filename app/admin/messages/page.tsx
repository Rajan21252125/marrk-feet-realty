'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, MessageSquare, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            if (data.messages) {
                setMessages(data.messages);
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load messages');
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            const res = await fetch(`/api/messages?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Message deleted');
                setMessages(messages.filter(m => m._id !== id));
            } else {
                toast.error('Failed to delete message');
            }
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">Messages</h1>
                <p className="text-gray-400">View and manage customer inquiries</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className="bg-primary/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-accent/5 hover:border-accent/30 transition-all group flex flex-col"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {msg.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg leading-tight">{msg.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(msg._id)}
                                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                title="Delete Message"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-black/20 rounded-xl p-4 text-sm text-gray-300 leading-relaxed mb-6 flex-grow border border-white/5">
                            "{msg.message}"
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                            <a
                                href={`mailto:${msg.email}`}
                                className="flex-1 inline-flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors border border-white/5"
                            >
                                <Mail className="w-4 h-4 text-accent" />
                                Reply
                            </a>
                            <a
                                href={`tel:${msg.phone}`}
                                className="flex-1 inline-flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors border border-white/5"
                            >
                                <Phone className="w-4 h-4 text-green-400" />
                                Call
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {messages.length === 0 && (
                <div className="text-center py-20 bg-primary/20 backdrop-blur-md rounded-3xl border border-white/10">
                    <div className="bg-white/5 p-6 rounded-full inline-block mb-6">
                        <MessageSquare className="w-12 h-12 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No messages yet</h3>
                    <p className="text-gray-400">New inquiries from interested buyers will appear here.</p>
                </div>
            )}
        </div>
    );
}
