"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/lib/translations";

interface MissionProps {
    data?: {
        badge?: string;
        title?: string;
        description?: string;
        bgImage?: string;
    }
}

export default function Mission({ data }: MissionProps) {
    const { language } = useLanguage();
    const {
        badge = "Our Mission",
        title = "Redefining modern luxury for everyone.",
        description = "We believe that style shouldn't come at the cost of sustainability or accessibility. Our goal is to create timeless pieces that empower you to express your unique self.",
        bgImage = "https://images.unsplash.com/photo-1529333446532-8180249c56b0?q=80&w=2600&auto=format&fit=crop"
    } = data || {};

    return (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background Image CMS */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div
                    className="w-full h-full bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url('${bgImage}')` }}
                />
            </div>

            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto text-white">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="block text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-4 text-white/80"
                >
                    {badge}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-8"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-2xl text-white/80 font-light leading-relaxed"
                >
                    {description}
                </motion.p>
            </div>
        </section>
    );
}
