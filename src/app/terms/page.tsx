"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <header className="border-b border-white/10 pb-12">
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Terms of Service</h1>
                        <p className="text-neutral-400">Last updated: {new Date().toLocaleDateString()}</p>
                    </header>

                    <section className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                Welcome to Said Store. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before making a purchase.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">2. Custom Designs</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                When using our Design Studio, you are responsible for the content you upload. You must own the rights to any images or text used. We reserve the right to refuse orders that contain offensive or copyrighted material without permission.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">3. Orders and Payments</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                All orders are subject to acceptance and availability. Prices are shown in MAD and include applicable taxes unless stated otherwise. Payment must be made in full at the time of order through our secure checkout.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">4. Shipping and Delivery</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs. Specific shipping terms can be found on our Shipping Information page.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                All content on this site, including logos, designs, and text, is the property of Said Store and protected by intellectual property laws. Reproduction without written consent is prohibited.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                            <p className="text-neutral-300 leading-relaxed">
                                Said Store shall not be liable for any direct, indirect, or consequential damages resulting from the use or inability to use our products or services.
                            </p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
