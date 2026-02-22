'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Star,
    TrendingUp,
    Zap,
    Search,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Package
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface Product {
    _id: string;
    title: string;
    image: string;
    category: string;
    isBestSeller: boolean;
    isNewArrival: boolean;
    featured: boolean;
}

export default function WebsiteManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?limit=50');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (productId: string, field: string, currentValue: boolean) => {
        setUpdatingId(`${productId}-${field}`);
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: !currentValue })
            });

            if (res.ok) {
                setProducts(products.map(p =>
                    p._id === productId ? { ...p, [field]: !currentValue } : p
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const SectionToggle = ({ productId, field, value, icon: Icon, label }: any) => (
        <button
            onClick={() => toggleStatus(productId, field, value)}
            disabled={updatingId === `${productId}-${field}`}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                value
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20"
                    : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
            )}
        >
            {updatingId === `${productId}-${field}` ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <Icon className={cn("w-3.5 h-3.5", value ? "text-white" : "text-gray-500")} />
            )}
            {label}
        </button>
    );

    return (
        <div className="space-y-8 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Collections Management</h1>
                    <p className="text-gray-400">Control which products appear in special collections across your storefront.</p>
                </div>

                <div className="relative group max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all group"
                            >
                                <div className="aspect-[16/10] relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {product.featured && <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Featured</span>}
                                        {product.isBestSeller && <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">Best Seller</span>}
                                        {product.isNewArrival && <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">New</span>}
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">{product.category}</p>
                                        <h3 className="font-bold text-white truncate">{product.title}</h3>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                        <SectionToggle
                                            productId={product._id}
                                            field="featured"
                                            value={product.featured}
                                            icon={Star}
                                            label="Featured"
                                        />
                                        <SectionToggle
                                            productId={product._id}
                                            field="isBestSeller"
                                            value={product.isBestSeller}
                                            icon={TrendingUp}
                                            label="Best Seller"
                                        />
                                        <SectionToggle
                                            productId={product._id}
                                            field="isNewArrival"
                                            value={product.isNewArrival}
                                            icon={Zap}
                                            label="New Arrival"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
