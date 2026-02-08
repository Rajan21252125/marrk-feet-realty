'use client';

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function Contact() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                }),
            });

            if (res.ok) {
                toast.success('Message sent successfully!');
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
            } else {
                toast.error('Failed to send message.');
            }
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="relative py-24 bg-gray-50 dark:bg-neutral-950 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-30">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-dark/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="grid gap-16 lg:grid-cols-2 items-center">
                    <div>
                        <span className="text-accent font-semibold tracking-wider text-sm uppercase">Get in Touch</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-6 text-primary-dark dark:text-white">Let&apos;s Discuss Your Real Estate Goals</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg leading-relaxed">
                            Whether you&apos;re looking to buy, sell, or invest, our team of dedicated advisors is ready to provide personalized guidance for your unique journey.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="bg-white dark:bg-white/10 p-4 rounded-xl text-accent shadow-sm border border-gray-100 dark:border-white/5 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-1 text-primary-dark dark:text-white">Global Headquarters</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        123 Real Estate Ave, Suite 400<br />
                                        New York, NY 10001
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-white dark:bg-white/10 p-4 rounded-xl text-accent shadow-sm border border-gray-100 dark:border-white/5 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-1 text-primary-dark dark:text-white">Direct Line</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        +1 (555) 123-4567
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Mon-Fri, 9am - 6pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-white dark:bg-white/10 p-4 rounded-xl text-accent shadow-sm border border-gray-100 dark:border-white/5 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-1 text-primary-dark dark:text-white">Email Us</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        info@markfeetrealty.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl">
                        <h3 className="text-2xl font-bold mb-6 text-primary-dark dark:text-white">Send us a message</h3>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">First name</label>
                                    <input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="flex h-12 w-full rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Last name</label>
                                    <input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="flex h-12 w-full rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="flex h-12 w-full rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="flex h-12 w-full rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    placeholder="1234567890"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="flex min-h-[150px] w-full rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-y"
                                    placeholder="Tell us about your property needs..."
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 text-white h-12 text-lg font-medium shadow-lg shadow-primary-dark/25 dark:shadow-accent/25 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'} {!loading && <Send size={18} className="ml-2" />}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
