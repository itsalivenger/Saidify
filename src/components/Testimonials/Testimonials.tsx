"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/lib/translations";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_TESTIMONIALS = [
    { id: 1, content: "The quality of the fabrics is outstanding. I've washed my hoodie multiple times and it still feels brand new. Fast shipping too!", author: "Alex Morgan", role: "Verified Buyer", rating: 5, avatarColor: "bg-blue-100 text-blue-600" },
    { id: 2, content: "I love the minimalist aesthetic of the new collection. It fits perfectly into my wardrobe. Definitely buying more.", author: "Sarah Chen", role: "Fashion Blogger", rating: 5, avatarColor: "bg-purple-100 text-purple-600" },
    { id: 3, content: "Customer service was incredibly helpful when I needed to exchange for a different size. The process was seamless.", author: "Michael Ross", role: "Loyal Customer", rating: 4, avatarColor: "bg-emerald-100 text-emerald-600" },
];

const AVATAR_COLORS = [
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-emerald-100 text-emerald-600",
    "bg-rose-100 text-rose-600",
    "bg-amber-100 text-amber-600",
];

export default function Testimonials() {
    const { language } = useLanguage();

    const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

    useEffect(() => {
        fetch('/api/settings')
            .then(r => r.json())
            .then(settings => {
                if (settings?.homepage?.testimonials?.length > 0) {
                    const mapped = settings.homepage.testimonials.map((t: any, i: number) => ({
                        ...t,
                        id: t._id || i,
                        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    }));
                    setTestimonials(mapped);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <section className="py-24 bg-muted/30">
            <div className="w-full px-4 md:px-8 max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-primary/10 text-primary"
                    >
                        <Quote className="w-6 h-6 fill-current" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        What Our Customers Say
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-border"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-4 h-4 fill-current",
                                            i < testimonial.rating ? "text-amber-400" : "text-gray-200 dark:text-gray-700"
                                        )}
                                    />
                                ))}
                            </div>

                            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                                &ldquo;{getLocalizedText(testimonial.content, language)}&rdquo;
                            </p>

                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                                    testimonial.avatarColor
                                )}>
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">{testimonial.author}</h4>
                                    <p className="text-sm text-muted-foreground">{getLocalizedText(testimonial.role, language)}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
