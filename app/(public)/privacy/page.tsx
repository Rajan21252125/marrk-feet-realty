import { SITE_NAME, CONTACT_INFO } from "@/lib/constants";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-dark dark:text-white mb-8">Privacy Policy</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-12 italic">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                    <p className="text-gray-600 dark:text-gray-300">
                        At {SITE_NAME}, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our real estate services.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We may collect personal information that you voluntarily provide to us when you:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Fill out contact forms or inquiry forms on our website.</li>
                            <li>Subscribe to our newsletter.</li>
                            <li>Communicate with us via email, phone, or messaging platforms.</li>
                            <li>Register for an account or provide property details.</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300 mt-4">
                            This information may include your name, email address, phone number, address, and your specific real estate preferences or requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We use the information we collect for several purposes, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>To provide the real estate services you request.</li>
                            <li>To respond to your inquiries and offer personalized property recommendations.</li>
                            <li>To send you administrative information, such as updates to our terms or policies.</li>
                            <li>To send you marketing communications and newsletters (you can opt-out at any time).</li>
                            <li>To improve our website&apos;s functionality and user experience.</li>
                            <li>To comply with legal obligations, including RERA requirements.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">3. Information Sharing</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>With your explicit consent.</li>
                            <li>With service providers who assist us in our operations (e.g., website hosting, email services).</li>
                            <li>To comply with legal processes or government requests (e.g., RERA, law enforcement).</li>
                            <li>To protect our rights, privacy, safety, or property.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">4. Data Security</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We implement appropriate technical and organizational measures to safeguard your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">5. Your Privacy Rights</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Access and receive a copy of your personal data.</li>
                            <li>Request correction of any inaccurate or incomplete data.</li>
                            <li>Request deletion of your data when it&apos;s no longer necessary for our operations.</li>
                            <li>Withdraw your consent at any time for data processing.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">6. Changes to This Policy</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">7. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            If you have any questions or concerns about this Privacy Policy, please contact us at:
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
