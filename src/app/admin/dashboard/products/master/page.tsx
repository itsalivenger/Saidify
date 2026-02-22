'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    Copy,
    Package,
    TrendingUp,
    Star,
    Zap,
    Loader2,
    AlertCircle,
    ChevronDown,
    MoreVertical,
    CheckCircle2
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
}

export default function InventoryControlPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [categories, setCategories] = useState<string[]>([]);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products?limit=100'),
                fetch('/api/categories')
            ]);

            if (prodRes.ok) {
                const data = await prodRes.json();
                setProducts(data.products);
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
        return matchesSearch && matchesCategory;
    });

    const stats = {
        total: products.length,
        lowStock: products.filter(p => p.stock < 5).length,
        featured: products.filter(p => p.featured).length
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Inventory Control</h1>
                    <p className="text-gray-400">Manage stock, visibility, and catalog details in one place.</p>
                </div>

                <div className="flex gap-4">
                    <StatCard label="Total Products" value={stats.total} icon={Package} color="blue" />
                    <StatCard label="Low Stock" value={stats.lowStock} icon={AlertCircle} color="red" />
                    <StatCard label="Featured" value={stats.featured} icon={Star} color="purple" />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                    />
                </div>

                <div className="flex gap-4">
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
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all h-full"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Add Product</span>
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Inventory Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                </div>
            ) : (
                <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status Toggles</th>
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {filteredProducts.map((p) => (
                                        <motion.tr
                                            key={p._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden flex-shrink-0">
                                                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-white truncate max-w-[200px]">{p.title}</p>
                                                        <p className="text-xs text-purple-500 font-bold uppercase tracking-tighter">{p.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        disabled={updatingId === `${p._id}-stock`}
                                                        onClick={() => handleStockUpdate(p._id, p.stock - 1)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all disabled:opacity-50"
                                                    >
                                                        -
                                                    </button>
                                                    <div className={cn(
                                                        "w-12 text-center font-black",
                                                        p.stock < 5 ? "text-red-500" : "text-emerald-500"
                                                    )}>
                                                        {updatingId === `${p._id}-stock` ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : p.stock}
                                                    </div>
                                                    <button
                                                        disabled={updatingId === `${p._id}-stock`}
                                                        onClick={() => handleStockUpdate(p._id, p.stock + 1)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all disabled:opacity-50"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4">
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
                                                        label="New"
                                                        loading={updatingId === `${p._id}-isNewArrival`}
                                                        onClick={() => handleToggle(p._id, 'isNewArrival', p.isNewArrival)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/dashboard/products/1?edit=${p._id}`}>
                                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(p._id)}
                                                        disabled={updatingId === p._id}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    >
                                                        {updatingId === p._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
            )}

            {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-20" />
                    <p className="text-xl font-bold text-gray-500">No products found match your criteria.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
                        className="text-purple-500 font-bold mt-2 hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}

const StatCard = ({ label, value, icon: Icon, color }: any) => {
    const colors: any = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    };

    return (
        <div className={cn("p-4 rounded-2xl border flex items-center gap-4 min-w-[160px]", colors[color])}>
            <div className="p-2 bg-white/10 rounded-xl">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
                <p className="text-2xl font-black">{value}</p>
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
            "p-2.5 rounded-xl border transition-all relative group",
            active
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20"
                : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:border-white/20"
        )}
    >
        {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <>
                <Icon className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {label}: {active ? 'ON' : 'OFF'}
                </span>
            </>
        )}
    </button>
);
