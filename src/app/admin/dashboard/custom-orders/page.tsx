'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette,
    Search,
    Filter,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ChevronRight,
    Loader2,
    Eye,
    Package,
    ArrowLeft,
    RefreshCw,
    MoreVertical,
    Check
} from 'lucide-react';
import Link from 'next/link';

interface DesignOrder {
    _id: string;
    userId: { name: string; email: string } | null;
    blankProduct: { _id: string; name: string; views: any[] } | null;
    selectedVariant: { color: string; size: string };
    status: string;
    totalPrice: number;
    thumbnail: string;
    createdAt: string;
}

const STATUS_CONFIG: any = {
    draft: { label: 'Draft', icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/10' },
    pending: { label: 'Pending', icon: RefreshCw, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    in_production: { label: 'In Production', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
};

export default function CustomOrdersDashboard() {
    const [orders, setOrders] = useState<DesignOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/design-orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/design-orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            }
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            (o.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (o.blankProduct?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <Palette className="w-8 h-8 text-purple-600" />
                        Custom Design Orders
                    </h1>
                    <p className="text-gray-400">Review and manage client creations from the Design Studio.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 transition-colors group-focus-within:text-purple-500" />
                    <input
                        type="text"
                        placeholder="Search by client or product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                    />
                </div>
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                    {['all', 'pending', 'in_production', 'shipped'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${statusFilter === f
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                    <p className="text-gray-500 font-bold animate-pulse">Loading Custom Designs...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Palette className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400">No matching designs found</h3>
                    <p className="text-gray-500">Wait for clients to submit their custom orders or adjust filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all group p-4 flex flex-col md:flex-row items-center gap-6"
                        >
                            {/* Preview */}
                            <div className="relative w-32 h-32 bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                                {order.thumbnail ? (
                                    <img src={order.thumbnail} className="w-full h-full object-contain" alt="Design Preview" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Package className="w-8 h-8 text-gray-700" />
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Product & Client</p>
                                    <h3 className="font-bold text-white text-lg">{order.blankProduct?.name || 'Unknown Product'}</h3>
                                    <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                        {order.userId?.name || 'Anonymous Client'}
                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                        {order.selectedVariant?.color || 'White'} / {order.selectedVariant?.size || 'M'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status & Price</p>
                                    <div className="flex items-center gap-3">
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${STATUS_CONFIG[order.status].bg} ${STATUS_CONFIG[order.status].color}`}>
                                            {(() => {
                                                const Icon = STATUS_CONFIG[order.status].icon;
                                                return <Icon className="w-3.5 h-3.5" />;
                                            })()}
                                            {STATUS_CONFIG[order.status].label}
                                        </span>
                                        <span className="font-black text-white">{order.totalPrice} MAD</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-1">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_production">In Production</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                    <Link
                                        href={`/design/${order.blankProduct?._id}?orderId=${order._id}&admin=true`}
                                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                        title="View Design in Studio"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Link>

                                    <button
                                        className="p-2.5 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all font-bold text-xs"
                                        title="Export Print Files"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
