"use client";

import { motion } from "framer-motion";

const TEAM = [
    {
        name: "Sarah Johnson",
        role: "Founder & Creative Director",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "David Chen",
        role: "Head of Design",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "Emily Rodriguez",
        role: "Marketing Lead",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
    },
    {
        name: "Michael Chang",
        role: "Lead Developer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop"
    }
];

export default function Team() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        The creative minds behind the brand.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {TEAM.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-neutral-100">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold">{member.name}</h3>
                            <p className="text-sm text-primary font-medium uppercase tracking-wide">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
