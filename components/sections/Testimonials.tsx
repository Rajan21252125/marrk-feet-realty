import { Quote, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Jonathan Reeves",
        role: "Portfolio Manager",
        quote: "Markfeet Realty transformed how I handle my portfolio. Their strategic reporting and property visibility are truly unmatched in the market.",
        image: "https://i.pravatar.cc/150?img=11"
    },
    {
        id: 2,
        name: "Sarah Jenkins",
        role: "Real Estate Investor",
        quote: "Working with Markfeet Realty was an excellent experience. They helped us find our dream home within our budget and managed everything.",
        image: "https://i.pravatar.cc/150?img=5"
    },
    {
        id: 3,
        name: "Michael Chen",
        role: "Venture Partner",
        quote: "The best management interface I've ever used. Clean, intuitive, and the customer support is responsive 24/7. Highly recommended.",
        image: "https://i.pravatar.cc/150?img=3"
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-white dark:bg-black">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-accent font-semibold tracking-wider text-sm uppercase">Client Stories</span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 mb-4 text-primary-dark dark:text-foreground">Trusted by Excellence</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Join thousands of satisfied property owners who trust Markfeet Realty with their most valuable assets.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="relative flex flex-col p-8 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-transparent hover:border-gray-200 dark:hover:border-neutral-800 transition-all duration-300 hover:shadow-lg group">
                            <Quote className="absolute top-8 right-8 h-8 w-8 text-gray-200 dark:text-neutral-800 group-hover:text-accent/20 transition-colors" />

                            <div className="flex gap-1 text-accent mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill="currentColor" className="text-accent" />
                                ))}
                            </div>

                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 flex-grow leading-relaxed">
                                &quot;{testimonial.quote}&quot;
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-neutral-800 shadow-md">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-primary-dark dark:text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
