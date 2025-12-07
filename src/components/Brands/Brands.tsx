"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Crown, Gem, Hexagon, Mountain, Shield, Zap } from "lucide-react";

const BRANDS = [
    { id: 1, name: "VOGUE", icon: Crown },
    { id: 2, name: "FORBES", icon: Gem },
    { id: 3, name: "WIRED", icon: Zap },
    { id: 4, name: "GQ", icon: Hexagon },
    { id: 5, name: "ELLE", icon: Shield },
    { id: 6, name: "VANITY FAIR", icon: Mountain },
];

export default function Brands() {
    return (
        <section className="py-12 bg-background border-y border-border">
            <div className="w-full overflow-hidden">
                <div className="flex">
                    {/* First Copy */}
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="flex flex-shrink-0 gap-12 md:gap-24 px-6 md:px-12 items-center"
                    >
                        {BRANDS.map((brand) => (
                            <div key={brand.id} className="flex items-center gap-3 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                                <brand.icon className="w-8 h-8 md:w-10 md:h-10" />
                                <span className="text-xl md:text-2xl font-black tracking-widest text-foreground/80">
                                    {brand.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Second Copy for Infinite Loop */}
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="flex flex-shrink-0 gap-12 md:gap-24 px-6 md:px-12 items-center"
                    >
                        {BRANDS.map((brand) => (
                            <div key={`copy-${brand.id}`} className="flex items-center gap-3 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                                <brand.icon className="w-8 h-8 md:w-10 md:h-10" />
                                <span className="text-xl md:text-2xl font-black tracking-widest text-foreground/80">
                                    {brand.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
