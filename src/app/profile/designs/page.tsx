'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Wand2, Package, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';

interface DesignOrder {
    _id: string;
    blankProduct: {
        _id: string;
        name: string;
    };
    selectedVariant: {
        color: string;
        size: string;
    };
    thumbnail: string;
    status: string;
    totalPrice: number;
    createdAt: string;
}

export default function MyDesignsPage() {
    const [designs, setDesigns] = useState<DesignOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const res = await fetch('/api/design-orders');
                if (res.ok) {
                    const data = await res.json();
                    setDesigns(data);
                }
            } catch (error) {
                console.error("Failed to fetch designs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDesigns();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this design?")) return;

        try {
            // We need a DELETE route for design orders
            const res = await fetch(`/api/design-orders/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDesigns(prev => prev.filter(d => d._id !== id));
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black mb-1">My Designs</h1>
                            <p className="text-neutral-400 font-medium">Manage your custom product masterpieces</p>
                        </div>
                    </div>
                    <Link
                        href="/design"
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-2xl font-black text-sm hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
                    >
                        <Wand2 className="w-4 h-4" /> Start New Design
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                    </div>
                ) : designs.length === 0 ? (
                    <div className="text-center py-32 bg-white/5 border border-white/10 rounded-[3rem]">
                        <Package className="w-20 h-20 text-neutral-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-black mb-2">No designs yet</h2>
                        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                            You haven't created any custom designs. Head to our design studio to craft something unique.
                        </p>
                        <Link
                            href="/design"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-black text-lg hover:scale-105 transition-all"
                        >
                            Explore Blank Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {designs.map((design) => (
                            <motion.div
                                key={design._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-purple-600/50 transition-all"
                            >
                                {/* Preview */}
                                <div className="aspect-[4/5] bg-white/5 relative overflow-hidden p-6 group-hover:p-4 transition-all">
                                    <img
                                        src={design.thumbnail}
                                        alt={design.blankProduct?.name}
                                        className="w-full h-full object-contain rounded-2xl"
                                    />
                                    <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleDelete(design._id)}
                                            className="p-3 bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${design.status === 'draft' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'
                                        }`}>
                                        {design.status}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-black text-xl mb-1">{design.blankProduct?.name || 'Deleted Product'}</h3>
                                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-tight">
                                                {design.selectedVariant.color} · {design.selectedVariant.size}
                                            </p>
                                        </div>
                                        <span className="font-black text-purple-500">{design.totalPrice} MAD</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/design/${design.blankProduct?._id}?orderId=${design._id}`}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-black text-sm transition-all"
                                        >
                                            <Pencil className="w-4 h-4" /> Edit Design
                                        </Link>
                                        <Link
                                            href={`/design/${design.blankProduct?._id}`}
                                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <p className="text-[10px] text-neutral-600 font-bold mt-4 uppercase text-center">
                                        Created on {new Date(design.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
