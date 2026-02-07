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

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="space-y-8 pb-10">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <MessageSquare className="text-accent" /> Messages
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((msg) => (
                    <div key={msg._id} className="bg-primary/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg hover:border-accent/50 transition-all group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleDelete(msg._id)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold text-white text-lg">{msg.name}</h3>
                            <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Mail className="w-4 h-4 text-accent" />
                                <a href={`mailto:${msg.email}`} className="hover:text-white transition-colors">{msg.email}</a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Phone className="w-4 h-4 text-accent" />
                                <a href={`tel:${msg.phone}`} className="hover:text-white transition-colors">{msg.phone}</a>
                            </div>
                        </div>

                        <div className="bg-black/20 rounded-lg p-3 text-sm text-gray-200 min-h-[80px]">
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {messages.length === 0 && (
                <div className="text-center py-20 bg-primary/10 rounded-3xl border border-white/5">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-400">No messages yet</h3>
                    <p className="text-gray-500 mt-2">New inquiries will appear here.</p>
                </div>
            )}
        </div>
    );
}
