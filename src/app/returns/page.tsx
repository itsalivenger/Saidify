"use client";

import { motion } from "framer-motion";
import { RefreshCcw, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ReturnsPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <header className="border-b border-white/10 pb-12">
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Returns & Exchanges</h1>
                        <p className="text-neutral-400">Our commitment to your satisfaction.</p>
                    </header>

                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl flex gap-4 items-start">
                        <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-rose-500 mb-1">Important: Custom Designs</h4>
                            <p className="text-sm text-neutral-300">Personalized items created in the Design Studio cannot be returned unless they arrive damaged or defective.</p>
                        </div>
                    </div>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <RefreshCcw className="w-6 h-6 text-purple-500" />
                                Standard Returns
                            </h2>
                            <ul className="space-y-4 text-neutral-400 text-sm">
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Items must be returned within 14 days of delivery.</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Products must be unworn, unwashed, and with original tags.</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Return shipping costs are the responsibility of the customer.</li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-amber-500" />
                                Non-Returnable Items
                            </h2>
                            <ul className="space-y-4 text-neutral-400 text-sm">
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" /> Sale items and limited drops.</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" /> Underwear and swimwear for hygiene reasons.</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" /> Custom-designed products (unless defective).</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                        <h2 className="text-3xl font-black uppercase mb-6">How to initiate a return</h2>
                        <ol className="space-y-6 list-decimal list-inside text-neutral-300">
                            <li>Contact our support team via the Contact page or WhatsApp.</li>
                            <li>Provide your order number and reason for return.</li>
                            <li>Once approved, we will provide you with the return address.</li>
                            <li>Ship the item back and share the tracking number.</li>
                            <li>Refunds are processed within 5-7 days after the item is received and inspected.</li>
                        </ol>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
