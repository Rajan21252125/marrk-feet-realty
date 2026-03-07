'use client';

import { Button } from '@/components/ui/Button';
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CONTACT_INFO } from '@/lib/constants';
import { FadeIn } from '@/components/ui/FadeIn';
import { SuccessModal } from '@/components/ui/SuccessModal';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: ''
    });
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
                setIsSuccessModalOpen(true);
                setFormData({ name: '', email: '', phone: '', message: '', subject: '' });
            } else {
                toast.error('Failed to send message.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-brand-navy/5">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-brand-navy overflow-hidden text-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="container relative z-10 mx-auto px-4">
                    <FadeIn direction="down">
                        <span className="text-brand-orange font-bold tracking-[0.3em] text-xs uppercase underline underline-offset-8">Reach Out</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mt-8 mb-6">Let&apos;s Start a <span className="text-brand-orange">Conversation</span></h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Have a question or ready to view a property? Our team is standing by to help you find your dream home.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 dark:bg-brand-navy/10 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Link href="/" className="hover:text-brand-orange">Home</Link>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-brand-navy dark:text-white">Contact Us</span>
                    </nav>
                </div>
            </div>

            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Contact Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-20">
                        {[
                            { icon: Phone, label: "Call Us", value: CONTACT_INFO.phone, sub: "Sales Inquiry", color: "bg-blue-500/10 text-blue-500" },
                            { icon: MessageSquare, label: "WhatsApp", value: CONTACT_INFO.phone, sub: "Instant Support", color: "bg-green-500/10 text-green-500" },
                            { icon: Mail, label: "Email Us", value: CONTACT_INFO.email, subValue: CONTACT_INFO.supportEmail, sub: "Sales & Support", color: "bg-brand-orange/10 text-brand-orange" },
                            { icon: Clock, label: "Visit Us", value: "9:00 AM - 6:00 PM", sub: "Mon-Sun Office Hours", color: "bg-purple-500/10 text-purple-500" }
                        ].map((item, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-2xl transition-all group">
                                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <item.icon size={24} />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                    <div className="space-y-1">
                                        <h4 className="text-[14px] font-bold text-brand-navy dark:text-white break-all">{item.value}</h4>
                                        {(item as any).subValue && <h4 className="text-[14px] font-bold text-brand-navy dark:text-white break-all">{(item as any).subValue}</h4>}
                                    </div>
                                    <p className="text-xs font-medium text-gray-500 mt-1">{item.sub}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        {/* Form Section */}
                        <div className="lg:col-span-3">
                            <FadeIn direction="left">
                                <div className="p-8 md:p-12 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl">
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-bold text-brand-navy dark:text-white mb-4">Send Us a Message</h2>
                                        <p className="text-gray-500">Fill out the form and our team will get back to you within 24 hours.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label htmlFor="contact-name" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="contact-name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full h-14 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-6 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all font-medium text-brand-navy dark:text-white"
                                                    placeholder="Enter your name"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="contact-phone" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="contact-phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full h-14 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-6 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all font-medium text-brand-navy dark:text-white"
                                                    placeholder="+91 00000 00000"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contact-email" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address (Optional)</label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="contact-email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full h-14 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-6 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all font-medium text-brand-navy dark:text-white"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contact-message" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                                            <textarea
                                                name="message"
                                                id="contact-message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full min-h-[160px] rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all font-medium text-brand-navy dark:text-white"
                                                placeholder="Tell us how we can help you..."
                                                required
                                            />
                                        </div>
                                        <Button
                                            className="w-full h-16 text-lg font-bold bg-brand-orange hover:bg-brand-orange/90 text-white rounded-2xl shadow-xl shadow-brand-orange/20"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending Request...' : 'Submit Inquiry'}
                                            {!loading && <Send className="ml-3 h-5 w-5" />}
                                        </Button>
                                    </form>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Map & Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <FadeIn direction="right">
                                <div className="space-y-8">
                                    <div className="p-8 rounded-[2.5rem] bg-brand-navy text-white">
                                        <h3 className="text-2xl font-bold mb-6">Our Location</h3>
                                        <div className="flex gap-4 mb-6">
                                            <MapPin className="text-brand-orange shrink-0" size={24} />
                                            <p className="text-gray-400 leading-relaxed text-sm">
                                                {CONTACT_INFO.address.full}
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <ShieldCheck className="text-brand-orange shrink-0" size={24} />
                                            <div>
                                                <p className="font-bold text-sm">RERA Registered Agent</p>
                                                <p className="text-xs text-brand-orange mt-1">ID: {CONTACT_INFO.rera}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-white/5 shadow-2xl">
                                        <iframe
                                            title="MarrkFeet Realty office location map"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15065.98661605658!2d72.8441!3d19.2812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b06821814e51%3A0x64323d85fd7db926!2sShanti%20Park%2C%20Mira%20Road%2C%20Mira%20Bhayandar%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1707328492021!5m2!1sen!2sin"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            className="grayscale hover:grayscale-0 transition-all duration-700"
                                        ></iframe>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
            />
        </div>
    );
}
