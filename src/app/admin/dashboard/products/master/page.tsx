'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    Package,
    TrendingUp,
    Star,
    Zap,
    Loader2,
    AlertCircle,
    ChevronDown,
    CheckCircle2,
    Palette
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    isBestSeller: boolean;
    isNewArrival: boolean;
    featured: boolean;
    isBlank?: boolean;
}

export default function InventoryControlPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [categories, setCategories] = useState<string[]>([]);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'regular' | 'customizable'>('regular');
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products?limit=200'),
                fetch('/api/categories')
            ]);

            if (prodRes.ok) {
                const data = await prodRes.json();
                setProducts(data.products || []);
            }

            if (catRes.ok) {
                const data = await catRes.json();
                setCategories(['All', ...data.map((c: any) => c.name)]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (productId: string, field: string, currentValue: boolean) => {
        setUpdatingId(`${productId}-${field}`);
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: !currentValue })
            });

            if (res.ok) {
                setProducts(prev => prev.map(p =>
                    p._id === productId ? { ...p, [field]: !currentValue } : p
                ));
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleStockUpdate = async (productId: string, newStock: number) => {
        if (newStock < 0) return;
        setUpdatingId(`${productId}-stock`);
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock })
            });

            if (res.ok) {
                setProducts(prev => prev.map(p =>
                    p._id === productId ? { ...p, stock: newStock } : p
                ));
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        setUpdatingId(productId);
        try {
            const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p._id !== productId));
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        const matchesTab = activeTab === 'customizable' ? p.isBlank : !p.isBlank;
        return matchesSearch && matchesCategory && matchesTab;
    });

    const stats = {
        total: products.length,
        lowStock: products.filter(p => p.stock < 5).length,
        customizable: products.filter(p => p.isBlank).length
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                            <Package className="text-purple-500 w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Inventory</h1>
                    </div>
                    <p className="text-gray-400 font-medium">Manage stock, visibility, and catalog details in one place.</p>
                </div>

                <div className="flex gap-4">
                    <StatCard label="Total Products" value={stats.total} icon={Package} color="blue" />
                    <StatCard label="Low Stock" value={stats.lowStock} icon={AlertCircle} color="red" />
                    <StatCard label="Customizable" value={stats.customizable} icon={Palette} color="purple" />
                </div>
            </div>

            {/* Tab Switcher & Toolbar */}
            <div className="space-y-4">
                <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('regular')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                            activeTab === 'regular'
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                                : "text-gray-500 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Package className="w-4 h-4" />
                        Regular Products
                        <span className={cn(
                            "ml-2 px-2 py-0.5 rounded-md text-[10px]",
                            activeTab === 'regular' ? "bg-white/20 text-white" : "bg-white/5 text-gray-500"
                        )}>
                            {products.filter(p => !p.isBlank).length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('customizable')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                            activeTab === 'customizable'
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                                : "text-gray-500 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Palette className="w-4 h-4" />
                        Customizable Products
                        <span className={cn(
                            "ml-2 px-2 py-0.5 rounded-md text-[10px]",
                            activeTab === 'customizable' ? "bg-white/20 text-white" : "bg-white/5 text-gray-500"
                        )}>
                            {products.filter(p => p.isBlank).length}
                        </span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/10 shadow-xl backdrop-blur-sm">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search in this tab..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="relative group min-w-[180px]">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer font-medium"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>

                        <Link href="/admin/dashboard/products/1">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-black py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all h-full"
                            >
                                <Plus className="w-5 h-5 shrink-0" />
                                <span className="hidden sm:inline">Add Product</span>
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Inventory Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-[3rem] border border-white/10 border-dashed">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading Catalog...</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <InventoryTable
                            products={filteredProducts}
                            updatingId={updatingId}
                            handleStockUpdate={handleStockUpdate}
                            handleToggle={handleToggle}
                            handleDelete={handleDelete}
                        />
                    </motion.div>
                </AnimatePresence>
            )}

            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-white/10 border-dashed text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-10" />
                    <p className="text-xl font-bold">No products found in this category.</p>
                </div>
            )}
        </div>
    );
}

const InventoryTable = ({ products, updatingId, handleStockUpdate, handleToggle, handleDelete }: any) => {
    if (products.length === 0) return (
        <div className="text-center py-20 bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/5">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No products in this section</p>
        </div>
    );

    return (
        <div className="bg-black/20 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product Info</th>
                            <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Stock Management</th>
                            <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Visibility & Trends</th>
                            <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        <AnimatePresence mode="popLayout">
                            {products.map((p: any) => (
                                <motion.tr
                                    key={p._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="hover:bg-white/[0.01] transition-colors group"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-[1.25rem] border border-white/10 overflow-hidden flex-shrink-0 bg-neutral-900 p-1 group-hover:scale-105 transition-transform">
                                                <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-white truncate max-w-[280px] text-lg leading-tight mb-1">{p.title}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-purple-500 font-black uppercase tracking-tighter bg-purple-500/10 px-2 py-0.5 rounded-md">{p.category}</span>
                                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">{p.price.toLocaleString()} MAD</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-4 bg-black/40 rounded-2xl p-2 w-fit mx-auto border border-white/5">
                                            <button
                                                disabled={updatingId === `${p._id}-stock`}
                                                onClick={() => handleStockUpdate(p._id, p.stock - 1)}
                                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <div className={cn(
                                                "w-12 text-center font-black text-xl",
                                                p.stock < 5 ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" : "text-emerald-500"
                                            )}>
                                                {updatingId === `${p._id}-stock` ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-purple-500" /> : p.stock}
                                            </div>
                                            <button
                                                disabled={updatingId === `${p._id}-stock`}
                                                onClick={() => handleStockUpdate(p._id, p.stock + 1)}
                                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <StatusToggle
                                                active={p.featured}
                                                icon={Star}
                                                label="Featured"
                                                loading={updatingId === `${p._id}-featured`}
                                                onClick={() => handleToggle(p._id, 'featured', p.featured)}
                                            />
                                            <StatusToggle
                                                active={p.isBestSeller}
                                                icon={TrendingUp}
                                                label="Best Seller"
                                                loading={updatingId === `${p._id}-isBestSeller`}
                                                onClick={() => handleToggle(p._id, 'isBestSeller', p.isBestSeller)}
                                            />
                                            <StatusToggle
                                                active={p.isNewArrival}
                                                icon={Zap}
                                                label="New Arrival"
                                                loading={updatingId === `${p._id}-isNewArrival`}
                                                onClick={() => handleToggle(p._id, 'isNewArrival', p.isNewArrival)}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/dashboard/products/1?edit=${p._id}`}>
                                                <button className="p-3.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 shadow-sm">
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                disabled={updatingId === p._id}
                                                className="p-3.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/10 shadow-sm"
                                            >
                                                {updatingId === p._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => {
    const colors: any = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    };

    return (
        <div className={cn("p-5 rounded-[1.5rem] border flex items-center gap-5 min-w-[200px] shadow-lg backdrop-blur-sm transition-all hover:scale-105", colors[color])}>
            <div className="p-3 bg-white/10 rounded-2xl shadow-inner">
                <Icon className="w-7 h-7" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">{label}</p>
                <p className="text-3xl font-black tabular-nums">{value}</p>
            </div>
        </div>
    );
};

const StatusToggle = ({ active, icon: Icon, label, onClick, loading }: any) => (
    <button
        onClick={onClick}
        disabled={loading}
        title={label}
        className={cn(
            "p-3 rounded-2xl border transition-all relative group shadow-sm",
            active
                ? "bg-purple-600 border-purple-500 text-white shadow-[0_8px_20px_rgba(147,51,234,0.3)] scale-110 z-10"
                : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:border-white/20"
        )}
    >
        {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
        ) : (
            <>
                <Icon className="w-5 h-5" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl border border-white/10 translate-y-2 group-hover:translate-y-0">
                    {label}: {active ? 'ACTIVE' : 'INACTIVE'}
                </div>
            </>
        )}
    </button>
);
