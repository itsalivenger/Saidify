'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Package,
    Settings,
    LogOut,
    ChevronRight,
    Box,
    Clock,
    CreditCard,
    ShoppingBag,
    Mail,
    MapPin,
    ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch info (we can use /api/cart GET or add a dedicated /api/me)
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    router.push('/shop/login');
                }
            } catch (err) {
                console.error("Profile fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        // Simple client-side logout (cookie will handle server side if not cleared, but let's assume session management)
        // Usually we'd call /api/auth/logout
        localStorage.removeItem('user');
        router.push('/shop');
        router.refresh();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(price);
    };

    if (loading) return (
        <div className="min-h-screen pt-32 pb-20 flex justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Nav */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-24 space-y-2">
                            <h1 className="text-3xl font-black mb-8">My Account</h1>

                            {[
                                { id: 'orders', label: 'Order History', icon: Package },
                                { id: 'wishlist', label: 'Wishlist', icon: ShoppingBag },
                                { id: 'settings', label: 'Settings', icon: Settings },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
                                        activeTab === tab.id
                                            ? "bg-purple-600 text-white shadow-xl shadow-purple-600/20"
                                            : "hover:bg-neutral-100 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-500/10 transition-all mt-8"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-black">Past Orders</h2>
                                        <span className="text-sm font-bold text-muted-foreground">{orders.length} total</span>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-16 text-center">
                                            <Box className="w-16 h-16 text-neutral-300 mx-auto mb-6" />
                                            <h3 className="text-2xl font-black mb-2">No orders yet</h3>
                                            <p className="text-muted-foreground mb-8">Ready to start your premium collection?</p>
                                            <Link
                                                href="/shop"
                                                className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform"
                                            >
                                                Go Shopping <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {orders.map((order) => (
                                                <div key={order._id} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2rem] overflow-hidden group hover:border-purple-500/30 transition-all">
                                                    <div className="p-8 border-b border-neutral-50 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="flex gap-6">
                                                            <div className="p-4 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                                                                <Package className="w-8 h-8 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-purple-500 uppercase tracking-widest mb-1">Order ID</p>
                                                                <h4 className="text-xl font-black tracking-tighter">#{order._id.slice(-8).toUpperCase()}</h4>
                                                                <span className={cn(
                                                                    "inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                                    order.status === 'delivered' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                                                )}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-8">
                                                            <div className="text-right">
                                                                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">Placed On</p>
                                                                <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">Total</p>
                                                                <p className="text-2xl font-black text-purple-600 tracking-tighter">{formatPrice(order.totalAmount)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-8 bg-neutral-50/50 dark:bg-neutral-900/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {order.items.map((item: any, idx: number) => (
                                                            <div key={idx} className="flex gap-4">
                                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-black">
                                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="font-bold truncate text-sm">{item.title}</h5>
                                                                    <p className="text-xs text-muted-foreground mt-1 uppercase font-black">
                                                                        {item.selectedSize} / {item.selectedColor}
                                                                        <span className="ml-2 text-neutral-400">Qty: {item.quantity}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}
