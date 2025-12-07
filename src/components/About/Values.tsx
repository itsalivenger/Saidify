"use client";

import { motion } from "framer-motion";
import { Leaf, Award, Heart, ShieldCheck } from "lucide-react";

const VALUES = [
    {
        icon: Leaf,
        title: "Sustainability",
        description: "We responsibly source our materials and ensure ethical manufacturing practices."
    },
    {
        icon: Award,
        title: "Quality",
        description: "We don't compromise. Every stitch is inspected to ensure longevity and durability."
    },
    {
        icon: Heart,
        title: "Passion",
        description: "Designed with love by a team that cares deeply about the art of fashion."
    },
    {
        icon: ShieldCheck,
        title: "Trust",
        description: "Transparent pricing and policies. We treat our community with honesty and respect."
    }
];

export default function Values() {
    return (
        <section className="py-24 bg-neutral-900 text-white">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {VALUES.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                                <value.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                            <p className="text-neutral-400 leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
