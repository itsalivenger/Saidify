"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function ContactForm() {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-10 shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Send us a Message</h3>
                <p className="text-muted-foreground">We usually reply within 24 hours.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                        Message
                    </label>
                    <textarea
                        id="message"
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-none dark:bg-neutral-800 dark:border-neutral-700"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-black text-white hover:bg-neutral-800 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                    Send Message <Send className="w-4 h-4" />
                </motion.button>
            </form>
        </div>
    );
}
