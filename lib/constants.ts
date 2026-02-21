export const SITE_NAME = "Marrk Feet Realty";

const ESTABLISHED_DATE = new Date('2024-10-12');

export const getYearsOfExperience = () => {
    const today = new Date();
    let years = today.getFullYear() - ESTABLISHED_DATE.getFullYear();
    const monthDiff = today.getMonth() - ESTABLISHED_DATE.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < ESTABLISHED_DATE.getDate())) {
        years--;
    }
    return years === 0 ? "Established 2024" : `${years}+ Years`;
};

export const CONTACT_INFO = {
    email: "Marrkfeetrealty2024@gmail.com",
    salesEmail: "info@marrkfeetrealty.in",
    phone: "9326914511",
    landline: "022-31480202",
    rera: "A51700044832",
    address: {
        line1: "Office No.13, Bldg No 39, Shanti Plaza, near BOI Bank",
        line2: "Shanti Park, Mira Road East, Mumbai - 401107",
        city: "Mira Bhayandar",
        state: "Maharashtra",
        full: "Office No.13, Bldg No 39, Shanti Plaza, near BOI Bank, Shanti Park, Mira Road East, Mumbai, Mira Bhayandar, Maharashtra 401107"
    },
    officeHours: "Mon-Sun, 9am - 6pm"
};

export const LEADERSHIP_TEAM = [
    {
        name: 'Ankit Singh',
        role: 'Founder',
        description: 'With expertise in real estate development, Ankit focuses on market trends and sustainable projects, leading the vision of innovation.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop'
    },
    {
        name: 'Amit Singh',
        role: 'Co-Founder',
        description: 'Amit handles sales, marketing, and business operations, building strong relationships with clients and stakeholders.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop'
    },
];

export const TEAM_STRUCTURE = {
    sourcing: [
        { name: 'Ankit Singh' },
        { name: 'Sargam Singh' }
    ],
    closing: [
        { name: 'Rajveer Singh' },
        { name: 'Amit Singh' }
    ],
    videoEditing: [
        { name: 'Rohit Mishra' },
        { name: 'Pratik Bhosale' }
    ]
};

export const SERVICES = [
    {
        title: "Property Sourcing & Acquisition",
        description: "Finding the perfect property that matches your criteria and investment goals."
    },
    {
        title: "Marketing & Sales Strategies",
        description: "Leveraging modern marketing to ensure your property reaches the right audience."
    },
    {
        title: "Video Production",
        description: "Professional property tours and cinematic showcases to bring properties to life."
    },
    {
        title: "Negotiation & Closing Expertise",
        description: "Handling the tough discussions to get you the best possible deal."
    },
    {
        title: "Property Buying & Selling",
        description: "End-to-end guidance for residential and commercial transactions."
    },
    {
        title: "Agreement & Paperwork",
        description: "Handling all legal documentation and registration for a smooth experience."
    },
    {
        title: "Investment Consulting",
        description: "Expert advice on market trends and future growth prospects in real estate."
    }
];

export const AREAS_SERVED = {
    region: "Mumbai Western Line",
    coverage: "Andheri to Virar"
};

export const SITE_STATS = [
    { label: 'Years of Experience', value: getYearsOfExperience() },
    { label: 'Happy Clients', value: '150+' },
    { label: 'Properties Sold', value: '100+' },
    { label: 'Active Listings', value: '50+' },
];

export const SOCIAL_LINKS = {
    facebook: "https://facebook.com/marrkfeetrealty",
    instagram: "https://instagram.com/marrkfeetrealty",
    twitter: "https://twitter.com/marrkfeetrealty",
    linkedin: "https://linkedin.com/company/marrkfeetrealty"
};
