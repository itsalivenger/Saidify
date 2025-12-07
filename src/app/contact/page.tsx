"use client";

import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import ContactForm from "@/components/Contact/ContactForm";
import ContactInfo from "@/components/Contact/ContactInfo";
import MapEmbed from "@/components/Contact/MapEmbed";
import FAQ from "@/components/Contact/FAQ";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="bg-neutral-900 text-white py-20 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-neutral-400 max-w-2xl mx-auto"
                    >
                        We'd love to hear from you. Please send us a message or visit us at our store.
                    </motion.p>
                </div>
            </section>

            <div className="container mx-auto max-w-7xl px-4 -mt-10 mb-24">
                <div className="grid lg:grid-cols-2 gap-12 bg-background rounded-3xl p-6 md:p-0">
                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="order-2 lg:order-1"
                    >
                        <ContactInfo />
                    </motion.div>

                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="order-1 lg:order-2"
                    >
                        <ContactForm />
                    </motion.div>
                </div>
            </div>

            <section className="container mx-auto max-w-7xl px-4 mb-24">
                <MapEmbed />
            </section>

            <section className="container mx-auto max-w-7xl px-4">
                <FAQ />
            </section>

            {/* Live Chat Floating Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
                title="Live Chat"
            >
                <MessageSquareText className="w-7 h-7" />
            </motion.button>
        </main>
    );
}
