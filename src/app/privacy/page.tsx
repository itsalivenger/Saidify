"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <header className="border-b border-white/10 pb-12">
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Privacy Policy</h1>
                        <p className="text-neutral-400">Last updated: {new Date().toLocaleDateString()}</p>
                    </header>

                    <section className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This may include your name, email, phone number, shipping address, and payment details.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                We use your info to process orders, provide customer support, improve our website, and send promotional communications if you opt-in. We do not sell your personal data to third parties.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                Our website uses cookies to enhance your browsing experience, remember your cart, and analyze traffic. You can manage cookie settings in your browser.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                You have the right to access, correct, or delete your personal information. Please contact us if you wish to exercise these rights.
                            </p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
