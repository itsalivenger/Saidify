"use client";

import { motion } from "framer-motion";

const TIMELINE = [
    {
        year: "2020",
        title: "The Beginning",
        description: "Pentabrood was born in a small studio, driven by a passion for quality materials and minimalist design."
    },
    {
        year: "2021",
        title: "First Collection",
        description: "We launched our signature 'Essentials' line, which sold out in just 48 hours, validating our vision."
    },
    {
        year: "2022",
        title: "Going Global",
        description: "Expanded shipping to over 50 countries and opened our first European distribution center."
    },
    {
        year: "2024",
        title: "Sustainability Pledge",
        description: "Committed to 100% eco-friendly packaging and carbon-neutral shipping for all orders."
    }
];

export default function Story() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-neutral-200 dark:bg-neutral-800 hidden md:block" />

                    <div className="space-y-12 md:space-y-24">
                        {TIMELINE.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="flex-1 text-center md:text-left">
                                    <div className={` md:px-8 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                        <span className="text-5xl font-black text-neutral-200 dark:text-neutral-800 absolute -z-10 select-none transform -translate-y-8 scale-150 opacity-50">
                                            {item.year}
                                        </span>
                                        <h3 className="text-2xl font-bold mb-2 relative z-10">{item.title}</h3>
                                        <p className="text-muted-foreground relative z-10">{item.description}</p>
                                    </div>
                                </div>

                                {/* Dot */}
                                <div className="w-4 h-4 bg-primary rounded-full relative z-10 ring-4 ring-background shrink-0 hidden md:block" />

                                <div className="flex-1 hidden md:block" />

                                {/* Mobile Year */}
                                <div className="md:hidden font-mono font-bold text-primary">{item.year}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
