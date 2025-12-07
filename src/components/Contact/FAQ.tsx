"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
    {
        question: "What are your shipping times?",
        answer: "We process orders within 1-2 business days. Shipping typically takes 3-5 business days for domestic orders and 7-14 days for international orders."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to over 50 countries worldwide. International shipping rates are calculated at checkout based on your location and package weight."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for all unworn items in their original packaging. Return shipping is free for domestic orders over $100."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order status by logging into your account."
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="max-w-3xl mx-auto w-full">
            <h3 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
            <div className="space-y-4">
                {FAQS.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900"
                    >
                        <button
                            onClick={() => setOpenIndex(prev => prev === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                        >
                            <span className="font-semibold text-lg">{faq.question}</span>
                            {openIndex === index ? (
                                <Minus className="w-5 h-5 text-primary" />
                            ) : (
                                <Plus className="w-5 h-5 text-neutral-400" />
                            )}
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="px-6 pb-6 text-muted-foreground border-t border-neutral-100 dark:border-neutral-800 pt-4">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
