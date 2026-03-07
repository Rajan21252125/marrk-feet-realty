'use client';

import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";

const testimonials = [
    {
        id: 1,
        name: "Rajesh Sharma",
        role: "Property Buyer",
        quote: "Finding a home in Mira Road was easy with MarkFeet Realty. Their team is extremely professional and guided me through every step of the RERA process.",
        image: "https://i.pravatar.cc/150?img=11"
    },
    {
        id: 2,
        name: "Priya Mehta",
        role: "Real Estate Investor",
        quote: "The best real estate agency in the Western Suburbs. Their transparent approach and cinematic property tours saved me so much time in decision making.",
        image: "https://i.pravatar.cc/150?img=5"
    },
    {
        id: 3,
        name: "Vikram Singh",
        role: "Venture Partner",
        quote: "Honest advice and great deals. They helped me close a commercial property deal in under 3 weeks. Highly recommend for any serious investor.",
        image: "https://i.pravatar.cc/150?img=3"
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-brand-navy dark:bg-black text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-brand-orange font-bold tracking-[0.3em] text-xs uppercase">Client Stories</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4">What Our Clients Say</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        Don't just take our word for it. Hear from dozens of families who found their dream homes through MarkFeet Realty.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <FadeIn key={testimonial.id} delay={index * 0.1} direction="up">
                            <div className="relative flex flex-col p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-brand-orange/30 transition-all duration-500 hover:bg-white/10 group h-full">
                                <Quote className="absolute top-8 right-8 h-10 w-10 text-brand-orange/20 group-hover:text-brand-orange/40 transition-colors" />

                                <div className="flex gap-1 text-brand-orange mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>

                                <p className="text-lg text-gray-300 mb-8 flex-grow leading-relaxed italic">
                                    &quot;{testimonial.quote}&quot;
                                </p>

                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-orange/20 shadow-xl">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg">{testimonial.name}</div>
                                        <div className="text-sm text-brand-orange/80 font-medium uppercase tracking-wider">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
