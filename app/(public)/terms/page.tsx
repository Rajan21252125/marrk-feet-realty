import { SITE_NAME, CONTACT_INFO } from "@/lib/constants";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-dark dark:text-white mb-8">Terms of Service</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-12 italic">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            By accessing and using the website of {SITE_NAME} (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use this website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">2. Real Estate Services</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {SITE_NAME} is a real estate agency licensed under RERA No: {CONTACT_INFO.rera}. All property listings and information provided on this website are for informational purposes only. While we strive for accuracy, we do not warrant that property descriptions, pricing, or other content is error-free, complete, or current.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">3. User Conduct</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            You agree to use this website only for lawful purposes. You are prohibited from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Providing false or misleading information.</li>
                            <li>Attempting to interfere with the proper functioning of the website.</li>
                            <li>Using any automated means to extract data (scraping) without our express permission.</li>
                            <li>Posting or transmitting any harmful, offensive, or illegal content.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">4. Privacy Policy</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Your use of our website is also governed by our Privacy Policy, which is incorporated into these terms by reference. Please review our Privacy Policy to understand our practices regarding your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">5. Intellectual Property</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            All content on this website, including text, graphics, logos, images, and software, is the property of {SITE_NAME} or its content suppliers and is protected by intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">6. Limitation of Liability</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            To the maximum extent permitted by law, {SITE_NAME} shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services or website content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">7. Governing Law</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            These terms shall be governed by and construed in accordance with the laws of India, particularly the regulations set forth by the Real Estate Regulatory Authority (RERA) of Maharashtra.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">8. Contact Information</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <div className="mt-4 p-6 bg-gray-50 dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-white/5">
                            <p className="font-bold text-primary-dark dark:text-white">{SITE_NAME}</p>
                            <p className="text-gray-600 dark:text-gray-300">{CONTACT_INFO.address.line1}, {CONTACT_INFO.address.line2}</p>
                            <p className="text-gray-600 dark:text-gray-300">{CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}</p>
                            <p className="text-gray-600 dark:text-gray-300">Email: {CONTACT_INFO.email}</p>
                            <p className="text-gray-600 dark:text-gray-300">Phone: {CONTACT_INFO.phone}</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
