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
    ChevronDown,
    Loader2,
    Eye,
    Package,
    ArrowLeft,
    RefreshCw,
    Printer,
    Download,
    Calendar,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import OrderReceipt from '@/components/Admin/OrderReceipt';

interface DesignOrder {
    _id: string;
    userId: { name: string; email: string } | null;
    blankProduct: { _id: string; name: string; views: any[] } | null;
    selectedVariant: { color: string; size: string };
    status: string;
    totalPrice: number;
    thumbnail: string;
    createdAt: string;
    // For receipt compatibility
    shippingAddress?: any;
}

const STATUS_CONFIG: any = {
    draft: { label: 'Draft', icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/10' },
    confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    pending: { label: 'Pending', icon: RefreshCw, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    in_production: { label: 'In Production', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
};

export default function CustomOrdersPage() {
    const [orders, setOrders] = useState<DesignOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [printingOrder, setPrintingOrder] = useState<any>(null);
    const [storeSettings, setStoreSettings] = useState<any>(null);

    useEffect(() => {
        fetchOrders();
        fetchSettings();
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

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setStoreSettings(data);
            }
        } catch (error) {
            console.error('Settings fetch error:', error);
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

    const handlePrint = (order: DesignOrder) => {
        // Adapt DesignOrder to Order interface for Receipt
        const adaptedOrder = {
            _id: order._id,
            createdAt: order.createdAt,
            totalAmount: order.totalPrice,
            paymentMethod: 'Custom Design Fulfillment',
            paymentStatus: 'paid',
            shippingAddress: {
                firstName: order.userId?.name.split(' ')[0] || 'Client',
                lastName: order.userId?.name.split(' ').slice(1).join(' ') || '',
                email: order.userId?.email || '',
                phone: 'N/A',
                address: 'Design Studio Order',
                city: 'N/A',
                zipCode: 'N/A'
            },
            items: [{
                title: `Custom ${order.blankProduct?.name || 'Design'}`,
                price: order.totalPrice,
                quantity: 1,
                selectedSize: order.selectedVariant?.size,
                selectedColor: order.selectedVariant?.color,
                image: order.thumbnail
            }]
        };
        setPrintingOrder(adaptedOrder);
        setTimeout(() => {
            window.print();
            setPrintingOrder(null);
        }, 100);
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            (o.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (o.blankProduct?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            o._id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            {/* Hidden Receipt for Printing */}
            <div className="hidden print:block fixed inset-0 z-[9999] bg-white">
                {printingOrder && (
                    <OrderReceipt
                        order={printingOrder}
                        storeSettings={{
                            name: storeSettings?.storeName,
                            logo: storeSettings?.logo,
                            email: storeSettings?.email,
                            phone: storeSettings?.phone
                        }}
                    />
                )}
            </div>

            <div className="print:hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                            <Palette className="w-8 h-8 text-purple-600" />
                            Custom Design Orders
                        </h1>
                        <p className="text-gray-400">Review and fulfill unique client creations.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 transition-colors group-focus-within:text-purple-500" />
                        <input
                            type="text"
                            placeholder="Search by client, product or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                        />
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
                        {['all', 'confirmed', 'pending', 'in_production', 'shipped', 'delivered', 'cancelled'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === f
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                        <p className="text-gray-500 font-bold animate-pulse text-sm">Loading Custom Designs...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <Palette className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">No custom designs found</h3>
                        <p className="text-gray-500 text-sm">Wait for clients to save their creations.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredOrders.map((order) => {
                            const isExpanded = expandedOrder === order._id;
                            const currentStatus = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                            const StatusIcon = currentStatus.icon;

                            return (
                                <motion.div
                                    key={order._id}
                                    layout
                                    className={cn(
                                        "bg-[#111] border rounded-3xl overflow-hidden transition-all group",
                                        isExpanded ? "border-purple-500/50 shadow-2xl shadow-purple-500/5" : "border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div
                                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                        className="p-5 flex flex-col md:flex-row items-center gap-6 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 flex-1 w-full">
                                            <div className="relative w-14 h-14 rounded-2xl bg-white/5 overflow-hidden border border-white/5 flex-shrink-0">
                                                {order.thumbnail ? (
                                                    <img src={order.thumbnail} className="w-full h-full object-contain" alt="" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-700">
                                                        <Package className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-white flex items-center gap-2">
                                                    {order.blankProduct?.name || 'Unknown Item'}
                                                    <span className="text-xs text-gray-500 font-medium hidden sm:inline">• {new Date(order.createdAt).toLocaleDateString()}</span>
                                                </h3>
                                                <p className="text-sm text-gray-400 truncate">
                                                    {order.userId?.name || 'Anonymous Client'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 w-full md:w-auto">
                                            <div className="flex flex-col items-center md:items-start min-w-[100px]">
                                                <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-1">Workflow</span>
                                                <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase", currentStatus.bg, currentStatus.color)}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {currentStatus.label}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center md:items-end min-w-[100px]">
                                                <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-1">Total Price</span>
                                                <span className="text-lg font-black text-white">{order.totalPrice} <span className="text-xs text-gray-500">MAD</span></span>
                                            </div>

                                            <button className={cn("p-2 rounded-xl transition-all", isExpanded ? "bg-purple-600 text-white" : "text-gray-600 hover:text-white bg-white/5")}>
                                                <ChevronDown className={cn("w-5 h-5 transition-transform", isExpanded && "rotate-180")} />
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5 bg-black/40"
                                            >
                                                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                    {/* Left: Preview & Tools */}
                                                    <div className="lg:col-span-4 space-y-6">
                                                        <div className="aspect-square bg-white rounded-[2rem] p-4 flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                                                            <img src={order.thumbnail} className="max-w-full max-h-full object-contain" alt="High Res Preview" />
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            <Link
                                                                href={`/design/${order.blankProduct?._id}?orderId=${order._id}&admin=true`}
                                                                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                                                            >
                                                                <Eye className="w-4 h-4" /> Open in Studio
                                                            </Link>
                                                            <button
                                                                onClick={() => handlePrint(order)}
                                                                className="w-full bg-purple-600 text-white rounded-2xl py-3.5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-700 hover:scale-[1.02] transition-all"
                                                            >
                                                                <Printer className="w-4 h-4" /> Print Order Form
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Right: Details & Status */}
                                                    <div className="lg:col-span-8 flex flex-col gap-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Client Information</h4>
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">
                                                                            {order.userId?.name?.[0] || 'A'}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-white text-sm">{order.userId?.name || 'Anonymous'}</p>
                                                                            <p className="text-xs text-gray-500 font-medium">{order.userId?.email || 'No email provided'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2 pt-2">
                                                                        <p className="text-xs text-gray-400 flex items-center gap-2">
                                                                            <Calendar className="w-3.5 h-3.5 text-gray-600" /> Created on {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 flex items-center gap-2">
                                                                            <Package className="w-3.5 h-3.5 text-gray-600" /> Variant: {order.selectedVariant?.color || 'White'} / {order.selectedVariant?.size || 'M'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Update Workflow</h4>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {['pending', 'in_production', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                                                        <button
                                                                            key={s}
                                                                            onClick={() => updateStatus(order._id, s)}
                                                                            className={cn(
                                                                                "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border",
                                                                                order.status === s
                                                                                    ? "bg-purple-600 border-purple-500 text-white"
                                                                                    : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10"
                                                                            )}
                                                                        >
                                                                            {s.replace('_', ' ')}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                                    <Clock className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-amber-500 text-xs uppercase tracking-widest">Awaiting Fulfillment</p>
                                                                    <p className="text-xs text-amber-500/60 font-medium mt-1">This design is approved and ready for production.</p>
                                                                </div>
                                                            </div>
                                                            <button className="px-5 py-2.5 bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.1em] rounded-xl hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
                                                                Start Production
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
