import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop"
                    alt="About Us"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Legacy Since 1995</h1>
                        <p className="text-xl md:text-2xl font-light text-gray-200">
                            Redefining the standard of luxury real estate with integrity, innovation, and unparalleled service.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-b border-gray-100 dark:border-white/10 pb-12">
                    {[
                        { label: 'Years of Experience', value: '25+' },
                        { label: 'Happy Clients', value: '1,200+' },
                        { label: 'Properties Sold', value: '$2B+' },
                        { label: 'Active Listings', value: '350+' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</p>
                            <p className="text-sm md:text-base text-gray-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Story & Vision */}
                <div className="grid gap-16 lg:grid-cols-2 items-center mb-24">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop"
                            alt="Our Story"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-white">
                            We don't just sell homes,<br /> we build relationships.
                        </h2>
                        <div className="w-20 h-1 bg-accent rounded-full"></div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            Founded with a vision to redefine the real estate experience, MarkFeetRealty combines cutting-edge technology with personalized service. We understand that buying or selling a home is more than just a transaction; it's a life-changing journey.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            Our team of seasoned experts is dedicated to guiding you through every step of the process with transparency, expertise, and a commitment to achieving your goals.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-white mb-4">Meet Our Leadership</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">The visionaries behind our success.</p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop' },
                            { name: 'Michael Chen', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop' },
                            { name: 'Elena Rodriguez', role: 'Senior Broker', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop' },
                        ].map((member, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-xl">
                                <div className="aspect-[3/4] relative">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100"></div>
                                    <div className="absolute bottom-0 left-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <h3 className="text-xl font-bold">{member.name}</h3>
                                        <p className="text-accent text-sm font-medium">{member.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
