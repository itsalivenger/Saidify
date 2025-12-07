"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export default function Newsletter() {
    return (
        <section className="py-24 bg-background">
            <div className="w-full px-4 md:px-8 max-w-4xl mx-auto">
                <div className="bg-neutral-900 dark:bg-neutral-50 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">

                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center justify-center p-3 mb-6 rounded-xl bg-white/10 text-white dark:text-black dark:bg-black/5"
                        >
                            <Mail className="w-6 h-6" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-bold tracking-tight text-white dark:text-black sm:text-4xl mb-4"
                        >
                            Join the Club
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-neutral-400 dark:text-neutral-600 mb-10 max-w-lg mx-auto"
                        >
                            Subscribe to our newsletter and get 10% off your first order plus exclusive access to new drops.
                        </motion.p>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 dark:bg-black/5 dark:border-black/5 dark:text-black dark:placeholder:text-neutral-500 dark:focus:ring-black/20 transition-all"
                            />
                            <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 dark:bg-black dark:text-white dark:hover:bg-neutral-800">
                                Subscribe <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.form>

                        <p className="mt-6 text-xs text-neutral-500">
                            By subscribing you agree to our Terms & Conditions.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
