"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NEW_ARRIVALS = [
    {
        id: 1,
        name: "Oversized Knit Sweater",
        price: "$85.00",
        imageColor: "bg-rose-100",
        badge: "Just In",
    },
    {
        id: 2,
        name: "Pleated Midi Skirt",
        price: "$65.00",
        imageColor: "bg-teal-100",
        badge: "New",
    },
    {
        id: 3,
        name: "Suede Loafers",
        price: "$110.00",
        imageColor: "bg-amber-100/50",
        badge: "Limited",
    },
    {
        id: 4,
        name: "Wool Blend Coat",
        price: "$240.00",
        imageColor: "bg-slate-200",
        badge: "Exclusive",
    },
];

export default function NewArrivals() {
    return (
        <section className="py-24 bg-background">
            <div className="w-full px-4 md:px-8 max-w-[1800px] mx-auto">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm font-bold uppercase tracking-widest text-primary mb-3"
                    >
                        Fresh Drops
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
                    >
                        New Arrivals
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {NEW_ARRIVALS.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className={cn(
                                "relative aspect-[3/4] w-full overflow-hidden rounded-md mb-6",
                                product.imageColor
                            )}>
                                {/* Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-black/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm">
                                        {product.badge}
                                    </span>
                                </div>

                                {/* Hover Overlay with Action */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white text-black p-4 rounded-full shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                                    >
                                        <Plus className="w-6 h-6" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-center text-center">
                                <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-muted-foreground font-semibold">
                                    {product.price}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
