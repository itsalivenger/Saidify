'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Wand2, Search, Filter, Package, Loader2, ArrowRight, Tag } from 'lucide-react';

interface BlankProduct {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    variants: { color: string; colorHex: string; sizes: string[] }[];
    views: { name: string; mockupImage: string; printZones: any[] }[];
    allowText: boolean;
    tags: string[];
}

export default function DesignStudioPage() {
    const [products, setProducts] = useState<BlankProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/blanks')
            .then(r => r.json())
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Banner */}
            <section className="relative py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
                </div>
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-6"
                    >
                        <Wand2 className="w-4 h-4 text-purple-400" />
                        Design Studio
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl font-black tracking-tight mb-4"
                    >
                        Create Your Own
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"> Custom Product</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-lg text-neutral-300 max-w-xl mx-auto mb-10"
                    >
                        Choose a blank product, upload your design, place it exactly where you want it — and we'll bring it to life.
                    </motion.p>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="max-w-md mx-auto relative"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-12 pr-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="container mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black">
                        {loading ? 'Loading...' : `${filtered.length} Product${filtered.length !== 1 ? 's' : ''} Available`}
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="font-bold">No products found</p>
                        <p className="text-sm mt-1">Try a different search term or check back soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                whileHover={{ y: -4 }}
                                className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-purple-500/10 transition-all"
                            >
                                {/* Mockup Preview */}
                                <div className="relative h-60 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900">
                                    {product.views[0]?.mockupImage ? (
                                        <img src={product.views[0].mockupImage} alt={product.name}
                                            className="w-full h-full object-contain p-6" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                            <Package className="w-12 h-12 opacity-20 mb-2" />
                                            <span className="text-xs">No preview</span>
                                        </div>
                                    )}

                                    {/* Views badge */}
                                    <div className="absolute top-3 left-3 flex gap-1 flex-wrap max-w-[80%]">
                                        {product.views.map(v => (
                                            <span key={v.name} className="px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-sm">
                                                {v.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="font-black text-lg leading-tight mb-1">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description || 'Choose your design, place it, and we print it.'}</p>

                                    {/* Color swatches */}
                                    {product.variants.length > 0 && (
                                        <div className="flex items-center gap-1.5 mb-4">
                                            {product.variants.slice(0, 6).map(v => (
                                                <div key={v.color} title={v.color}
                                                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700"
                                                    style={{ backgroundColor: v.colorHex }} />
                                            ))}
                                            {product.variants.length > 6 && (
                                                <span className="text-xs text-muted-foreground font-bold">+{product.variants.length - 6}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {product.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {product.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 bg-neutral-100 dark:bg-white/5 rounded-full text-muted-foreground">
                                                    <Tag className="w-2.5 h-2.5" />{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                        <span className="text-lg font-black text-purple-600">From {product.basePrice} MAD</span>
                                        <Link
                                            href={`/design/${product._id}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors group"
                                        >
                                            Design
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
