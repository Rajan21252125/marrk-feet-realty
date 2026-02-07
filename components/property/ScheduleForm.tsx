'use client';

import { Button } from "@/components/ui/Button";
import { Calendar, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function ScheduleForm({ propertyTitle }: { propertyTitle: string }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `Inquiry for property: ${propertyTitle}. Preferred Date: ${formData.date}`,
                }),
            });

            if (res.ok) {
                toast.success('Request sent successfully!');
                setSuccess(true);
                setFormData({ name: '', email: '', phone: '', date: '' });
            } else {
                toast.error('Failed to send request.');
            }
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-2">Request Sent!</h3>
                <p className="text-gray-500 mb-6">An agent will contact you shortly to confirm your viewing.</p>
                <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
                    Send Another Request
                </Button>
            </div>
        );
    }

    return (
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">Full Name</label>
                <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
                    required
                />
            </div>
            <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">Phone</label>
                <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                    required
                />
            </div>
            <div>
                <label htmlFor="date" className="mb-2 block text-sm font-medium">Preferred Date</label>
                <div className="relative">
                    <input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-transparent"
                        required
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>
            <div className="mt-2">
                <Button
                    type="submit"
                    className="w-full bg-primary-dark hover:bg-primary-dark/90 text-white"
                    size="lg"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Schedule Viewing'}
                </Button>
            </div>
        </form>
    );
}
