'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
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
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Printer,
    Download,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import OrderReceipt from '@/components/Admin/OrderReceipt';

interface Order {
    _id: string;
    userId: { name: string; email: string };
    items: any[];
    totalAmount: number;
    shippingAddress: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        zipCode: string;
    };
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
}

const STATUS_CONFIG: any = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    processing: { label: 'Processing', icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
};

export default function RegularOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
    const [storeSettings, setStoreSettings] = useState<any>(null);

    useEffect(() => {
        fetchOrders();
        fetchSettings();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/orders');
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

    const handlePrint = (order: Order) => {
        setPrintingOrder(order);
        setTimeout(() => {
            window.print();
            setPrintingOrder(null);
        }, 100);
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.shippingAddress.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.shippingAddress.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.shippingAddress.email.toLowerCase().includes(searchQuery.toLowerCase());
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
                            <ShoppingCart className="w-8 h-8 text-purple-600" />
                            Regular Shop Orders
                        </h1>
                        <p className="text-gray-400">Monitor and manage all standard product sales.</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                        title="Refresh Data"
                    >
                        <Loader2 className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 transition-colors group-focus-within:text-purple-500" />
                        <input
                            type="text"
                            placeholder="Search by ID, name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                        />
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
                        {['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'pending'].map((f) => (
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
                        <p className="text-gray-500 font-bold animate-pulse text-sm">Loading Orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <ShoppingCart className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">No orders found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
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
                                    {/* Order Summary Row */}
                                    <div
                                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                        className="p-5 flex flex-col md:flex-row items-center gap-6 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 flex-1 w-full">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-500 border border-white/5">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-white flex items-center gap-2">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                    <span className="text-xs text-gray-500 font-medium hidden sm:inline">• {new Date(order.createdAt).toLocaleDateString()}</span>
                                                </h3>
                                                <p className="text-sm text-gray-400 truncate">
                                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto scrollbar-hide">
                                            <div className="flex flex-col items-center md:items-start min-w-[100px]">
                                                <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-1">Status</span>
                                                <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase", currentStatus.bg, currentStatus.color)}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {currentStatus.label}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center md:items-start min-w-[80px]">
                                                <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-1">Payment</span>
                                                <span className={cn(
                                                    "text-xs font-bold",
                                                    order.paymentStatus === 'paid' ? "text-emerald-500" :
                                                        order.paymentStatus === 'failed' ? "text-rose-500" : "text-amber-500"
                                                )}>
                                                    {order.paymentStatus.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="flex flex-col items-center md:items-end min-w-[100px]">
                                                <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-1">Amount</span>
                                                <span className="text-lg font-black text-white">{order.totalAmount} <span className="text-xs text-gray-500">MAD</span></span>
                                            </div>

                                            <button className={cn("p-2 rounded-xl transition-all", isExpanded ? "bg-purple-600 text-white" : "text-gray-600 hover:text-white bg-white/5")}>
                                                <ChevronDown className={cn("w-5 h-5 transition-transform", isExpanded && "rotate-180")} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5 bg-black/40"
                                            >
                                                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                    {/* Left: Items */}
                                                    <div className="lg:col-span-8 space-y-6">
                                                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                                            <Package className="w-4 h-4" /> Order Items ({order.items.length})
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10">
                                                                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                                                                        {item.image ? (
                                                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center"><Package className="text-gray-800" /></div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-bold text-white text-sm">{item.title}</p>
                                                                        <p className="text-xs text-gray-500 font-bold uppercase mt-1">
                                                                            {item.selectedSize} / {item.selectedColor}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-xs font-bold text-gray-400">Qty: {item.quantity}</p>
                                                                        <p className="text-sm font-black text-purple-500 mt-1">{item.price} <span className="text-[10px]">MAD</span></p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Right: Client & Actions */}
                                                    <div className="lg:col-span-4 space-y-6">
                                                        <div className="space-y-6 p-6 rounded-3xl bg-white/5 border border-white/5">
                                                            <div className="space-y-4">
                                                                <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                                                    <MapPin className="w-4 h-4" /> Shipping Info
                                                                </h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <p className="font-bold text-white uppercase text-xs tracking-wider">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                                                    <p className="text-gray-400 leading-relaxed font-medium">
                                                                        {order.shippingAddress.address}<br />
                                                                        {order.shippingAddress.zipCode}, {order.shippingAddress.city}
                                                                    </p>
                                                                    <div className="pt-2 space-y-2">
                                                                        <p className="text-gray-400 flex items-center gap-2">
                                                                            <Mail className="w-4 h-4 text-gray-600" /> {order.shippingAddress.email}
                                                                        </p>
                                                                        <p className="text-gray-400 flex items-center gap-2">
                                                                            <Phone className="w-4 h-4 text-gray-600" /> {order.shippingAddress.phone}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="pt-6 border-t border-white/5 space-y-3">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handlePrint(order); }}
                                                                    className="w-full bg-purple-600 text-white rounded-2xl py-3.5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-700 hover:scale-[1.02] transition-all"
                                                                >
                                                                    <Printer className="w-4 h-4" /> Download Receipt
                                                                </button>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <button className="bg-white/5 text-gray-300 rounded-xl py-2.5 font-bold text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all">Track Order</button>
                                                                    <button className="bg-white/5 text-gray-300 rounded-xl py-2.5 font-bold text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all">Send Email</button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Status Update Trigger */}
                                                        <div className="flex items-center gap-2 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                                                            <Clock className="w-4 h-4" />
                                                            Ready for Processing
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
