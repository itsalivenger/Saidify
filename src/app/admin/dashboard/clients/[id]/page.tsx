'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ShoppingCart,
    Package,
    Mail,
    MapPin,
    Calendar,
    ArrowLeft,
    Box,
    Clock,
    Download,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface User {
    _id: string;
    name: string;
    email: string;
    cart: any[];
    createdAt: string;
}

interface Order {
    _id: string;
    items: any[];
    totalAmount: number;
    status: string;
    createdAt: string;
    paymentMethod: string;
}

export default function ClientProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch user
                const userRes = await fetch(`/api/admin/users/${id}`);
                // Fetch orders
                const ordersRes = await fetch(`/api/admin/orders?userId=${id}`);

                if (userRes.ok) setUser(await userRes.json());
                if (ordersRes.ok) setOrders(await ordersRes.json());
            } catch (error) {
                console.error("Failed to fetch customer details", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(price);
    };

    if (loading) return (
        <div className="p-8 animate-pulse space-y-8">
            <div className="w-48 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-64 bg-neutral-100 dark:bg-neutral-900 rounded-3xl" />
                <div className="md:col-span-2 h-64 bg-neutral-100 dark:bg-neutral-900 rounded-3xl" />
            </div>
        </div>
    );

    if (!user) return (
        <div className="p-20 text-center">
            <h1 className="text-4xl font-black mb-4">Customer not found</h1>
            <Link href="/admin/dashboard/clients" className="text-purple-600 font-bold hover:underline">Return to list</Link>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto pb-24">
            <Link
                href="/admin/dashboard/clients"
                className="flex items-center gap-2 text-muted-foreground hover:text-purple-600 transition-all group mb-8 inline-block"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold">Back to Customers</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
                {/* Left Side: Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 sticky top-24 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10" />

                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white mb-4 shadow-xl shadow-purple-500/20">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-black">{user.name}</h2>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-neutral-50 dark:border-neutral-800">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
                                        <ShoppingCart className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <span className="text-sm font-bold text-neutral-500">Active Cart</span>
                                </div>
                                <span className="font-black text-lg">{user.cart.length}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
                                        <Package className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="text-sm font-bold text-neutral-500">Total Orders</span>
                                </div>
                                <span className="font-black text-lg">{orders.length}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-neutral-50 dark:border-neutral-800 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Last active 2 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Cart & Orders */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Active Cart */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black">Active Cart</h3>
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Needs Attention
                            </span>
                        </div>

                        {user.cart.length === 0 ? (
                            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-12 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                                <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">This customer&apos;s cart is empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.cart.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
                                        <div className="w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-sm truncate">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                                                {item.selectedSize} / {item.selectedColor}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs font-bold bg-neutral-50 dark:bg-white/5 p-1 rounded">Qty: {item.quantity}</span>
                                                <span className="font-black text-purple-600">{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Order History */}
                    <section>
                        <h3 className="text-2xl font-black mb-6">Order History</h3>

                        {orders.length === 0 ? (
                            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-12 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                                <Box className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">No orders placed yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order._id} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all">
                                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-50 dark:border-neutral-800">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-black tracking-tight text-neutral-400">#{order._id.slice(-8).toUpperCase()}</span>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                        order.status === 'delivered' ? "bg-emerald-500/10 text-emerald-600" :
                                                            order.status === 'pending' ? "bg-amber-500/10 text-amber-600" : "bg-purple-500/10 text-purple-600"
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total</p>
                                                    <p className="text-xl font-black text-purple-600">{formatPrice(order.totalAmount)}</p>
                                                </div>
                                                <button className="p-3 rounded-2xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors">
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-neutral-50/50 dark:bg-black/20 flex gap-4 overflow-x-auto scrollbar-hide">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-white dark:bg-neutral-900 p-2 pr-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                    <div>
                                                        <p className="text-xs font-bold truncate w-24">{item.title}</p>
                                                        <p className="text-[10px] text-muted-foreground">x{item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
