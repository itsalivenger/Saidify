"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/lib/translations";
import { Leaf, Award, Heart, ShieldCheck, Users, Target, Globe, Zap, Star, Smile } from "lucide-react";

const ICON_MAP: any = {
    Leaf, Award, Heart, ShieldCheck, Users, Target, Globe, Zap, Star, Smile
};

interface ValuesProps {
    data?: Array<{
        title: string;
        description: string;
        iconName: string;
    }>;
}

const DEFAULT_VALUES = [
    {
        iconName: "Leaf",
        title: "Sustainability",
        description: "We responsibly source our materials and ensure ethical manufacturing practices."
    },
    {
        iconName: "Award",
        title: "Quality",
        description: "We don't compromise. Every stitch is inspected to ensure longevity and durability."
    },
    {
        iconName: "Heart",
        title: "Passion",
        description: "Designed with love by a team that cares deeply about the art of fashion."
    },
    {
        iconName: "ShieldCheck",
        title: "Trust",
        description: "Transparent pricing and policies. We treat our community with honesty and respect."
    }
];

export default function Values({ data }: ValuesProps) {
    const { language } = useLanguage();
    const values = data?.length ? data : DEFAULT_VALUES;

    return (
        <section className="py-24 bg-neutral-900 text-white">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {values.map((value, index) => {
                        const Icon = ICON_MAP[value.iconName] || Leaf;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{getLocalizedText(value.title, language)}</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    {getLocalizedText(value.description, language)}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
