"use client";

import { motion } from "framer-motion";
import { Truck, Globe, Clock, ShieldCheck } from "lucide-react";

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <header className="border-b border-white/10 pb-12">
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Shipping Info</h1>
                        <p className="text-neutral-400">Everything you need to know about delivery.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                            <Truck className="w-8 h-8 text-purple-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Local Delivery</h3>
                            <p className="text-neutral-400 text-sm">Free delivery within Casablanca and Rabat for orders over 500 MAD.</p>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                            <Globe className="w-8 h-8 text-emerald-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">National Shipping</h3>
                            <p className="text-neutral-400 text-sm">Flat rate shipping of 40 MAD for all other cities in Morocco.</p>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                            <Clock className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Processing Time</h3>
                            <p className="text-neutral-400 text-sm">Regular orders ship in 1-2 days. Custom designs take 3-5 days for production.</p>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                            <ShieldCheck className="w-8 h-8 text-blue-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Secure Tracking</h3>
                            <p className="text-neutral-400 text-sm">Track your order status directly from your profile dashboard.</p>
                        </div>
                    </div>

                    <section className="space-y-8 bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                        <h2 className="text-3xl font-black uppercase tracking-tight">FAQ</h2>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-white mb-2">How long will my order take?</h4>
                                <p className="text-neutral-400 text-sm">Standard delivery usually takes 2-4 business days after dispatch across Morocco.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2">Can I change my shipping address?</h4>
                                <p className="text-neutral-400 text-sm">Address changes can only be made before the order is marked as "Shipped". Contact us immediately for changes.</p>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
