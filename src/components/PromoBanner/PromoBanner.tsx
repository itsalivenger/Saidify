"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/lib/translations";
import { motion } from "framer-motion";
import { ArrowRight, Timer } from "lucide-react";

export default function PromoBanner() {
    const { language } = useLanguage();

    const [data, setData] = useState({
        title: "End of Season",
        subtitle: "Clearance Sale",
        description: "Save up to 50% on selected premium styles. Don't miss out on the biggest deals of the year.",
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop",
        ctaText: "Shop The Sale",
        active: true,
    });

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        fetch('/api/settings')
            .then(r => r.json())
            .then(settings => {
                if (settings?.homepage?.promoBanner) {
                    setData(prev => ({ ...prev, ...settings.homepage.promoBanner }));
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        const timer = setInterval(() => {
            const now = new Date();
            const difference = endDate.getTime() - now.getTime();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!data.active) return null;

    const timeUnits = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
    ];

    return (
        <section className="py-24 px-4 md:px-8">
            <div className="w-full max-w-[1800px] mx-auto relative overflow-hidden rounded-3xl bg-neutral-900 text-white dark:bg-neutral-50 dark:text-black">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url('${data.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-transparent dark:from-neutral-50 dark:via-neutral-50/90" />

                <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-12 md:p-24 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold tracking-wide uppercase"
                        >
                            <Timer className="w-4 h-4" />
                            Limited Time Offer
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black tracking-tight"
                        >
                            {getLocalizedText(data.title, language)}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-700">
                                {getLocalizedText(data.subtitle, language)}
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-neutral-300 dark:text-neutral-600 max-w-lg"
                        >
                            {getLocalizedText(data.description, language)}
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group bg-white text-black dark:bg-black dark:text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
                        >
                            {data.ctaText}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex justify-center lg:justify-end gap-4 md:gap-6">
                        {timeUnits.map((unit, index) => (
                            <motion.div
                                key={unit.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="flex flex-col items-center bg-white/10 dark:bg-black/5 backdrop-blur-md rounded-2xl p-4 md:p-6 w-20 md:w-24 border border-white/10 dark:border-black/10"
                            >
                                <span className="text-3xl md:text-4xl font-bold font-mono">
                                    {unit.value.toString().padStart(2, "0")}
                                </span>
                                <span className="text-xs md:text-sm uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mt-2">
                                    {unit.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
