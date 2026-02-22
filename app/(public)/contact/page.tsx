'use client';

import { Button } from '@/components/ui/Button';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CONTACT_INFO } from '@/lib/constants';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `[Subject: ${formData.subject}] ${formData.message}`,
                }),
            });

            if (res.ok) {
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', phone: '', message: '', subject: '' });
            } else {
                toast.error('Failed to send message.');
            }
        } catch (_error) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Hero Section */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
                    alt="Contact Us"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl md:text-2xl font-light text-gray-200">We&apos;re here to turn your real estate dreams into reality.</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Contact Information */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-3xl font-bold text-primary-dark dark:text-white mb-6">Get in Touch</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                Whether you&apos;re looking to buy, sell, or invest, our team of dedicated advisors is ready to provide personalized guidance.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="rounded-full bg-accent/10 p-4 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-primary-dark dark:text-white">Visit Our Office</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                                        {CONTACT_INFO.address.line1}<br />
                                        {CONTACT_INFO.address.line2}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="rounded-full bg-accent/10 p-4 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-primary-dark dark:text-white">Call Us</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                                        Mob: {CONTACT_INFO.phone}<br />
                                        Landline: {CONTACT_INFO.landline}<br />
                                        {CONTACT_INFO.officeHours}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="rounded-full bg-accent/10 p-4 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-primary-dark dark:text-white">Email Us</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                                        {CONTACT_INFO.email}<br />
                                        {CONTACT_INFO.salesEmail}<br />
                                        <span className="font-bold text-accent">RERA: {CONTACT_INFO.rera}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map Integration */}
                        <div className="h-64 w-full overflow-hidden rounded-2xl grayscale hover:grayscale-0 transition-all duration-500 shadow-lg border border-gray-200 dark:border-white/10">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26453.36495834861!2d-118.4200676451664!3d34.08697695325964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147cf%3A0x600100483863779e!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1707328492021!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-white/10">
                        <h2 className="text-3xl font-bold text-primary-dark dark:text-white mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full h-12 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full h-12 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                    placeholder="Property Inquiry..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full min-h-[150px] rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                    placeholder="How can we help you today?"
                                    required
                                />
                            </div>
                            <Button
                                className="w-full h-12 text-lg font-semibold bg-accent hover:bg-accent/90 text-white"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                                {!loading && <Send className="ml-2 h-5 w-5" />}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
