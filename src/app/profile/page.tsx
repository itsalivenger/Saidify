"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Settings,
    LogOut,
    Box,
    ShoppingBag,
    Mail,
    Phone,
    User as UserIcon,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/Shop/Breadcrumbs";

export default function ProfilePage() {
    const { user, loading, isAuthenticated, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login?message=Please log in to view your profile.");
        }
    }, [loading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchOrders = async () => {
                try {
                    const res = await fetch("/api/orders");
                    if (res.ok) {
                        const data = await res.json();
                        setOrders(data);
                    }
                } catch (err) {
                    console.error("Order fetch error", err);
                } finally {
                    setOrdersLoading(false);
                }
            };
            fetchOrders();
        }
    }, [isAuthenticated]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-MA", {
            style: "currency",
            currency: "MAD",
        }).format(price);
    };

    if (loading || (!user && isAuthenticated)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                <Breadcrumbs />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">My Profile</h1>
                        <p className="text-muted-foreground font-medium">Manage your orders and account settings.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3 space-y-2">
                        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 mb-8 text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                                <UserIcon className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-black truncate">{user.name}</h3>
                            <p className="text-sm text-muted-foreground truncate mb-1">{user.email}</p>
                            {user.phone && <p className="text-xs font-bold text-neutral-400">{user.phone}</p>}
                        </div>

                        {[
                            { id: "orders", label: "My Orders", icon: Package },
                            { id: "settings", label: "Settings", icon: Settings },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
                                    activeTab === tab.id
                                        ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                                        : "hover:bg-neutral-100 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-500/10 transition-all mt-6"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === "orders" && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-black tracking-tight">Order History</h2>
                                        <span className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                            {orders.length} total
                                        </span>
                                    </div>

                                    {ordersLoading ? (
                                        <div className="flex justify-center p-20">
                                            <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-16 text-center">
                                            <Box className="w-16 h-16 text-neutral-300 mx-auto mb-6" />
                                            <h3 className="text-2xl font-black mb-2">No orders yet</h3>
                                            <p className="text-muted-foreground mb-8 text-sm">You haven't placed any orders yet. Start shopping our premium collection!</p>
                                            <Link
                                                href="/shop"
                                                className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-2xl font-black inline-flex items-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98]"
                                            >
                                                Start Shopping <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {orders.map((order) => (
                                                <div
                                                    key={order._id}
                                                    className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
                                                >
                                                    <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="flex gap-6">
                                                            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
                                                                <Package className="w-8 h-8 text-neutral-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Order #</p>
                                                                <h4 className="text-xl font-black tracking-tighter uppercase">{order._id.slice(-8)}</h4>
                                                                <span className={cn(
                                                                    "inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                                    order.status === "delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                                )}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-10">
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Date</p>
                                                                <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Amount</p>
                                                                <p className="text-2xl font-black tracking-tighter">{formatPrice(order.totalAmount)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-8 bg-neutral-50/50 dark:bg-neutral-900/30 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {order.items.map((item: any, idx: number) => (
                                                            <div key={idx} className="flex gap-4">
                                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-800 bg-white">
                                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="font-bold truncate text-sm">{item.title}</h5>
                                                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-black tracking-wider">
                                                                        {item.selectedSize} / {item.selectedColor}
                                                                        <span className="ml-2 text-neutral-400">× {item.quantity}</span>
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

                            {activeTab === "settings" && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="max-w-2xl"
                                >
                                    <h2 className="text-2xl font-black mb-8 tracking-tight">Account Settings</h2>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
                                                <div className="bg-neutral-100 dark:bg-neutral-900 px-6 py-4 rounded-2xl font-bold border border-transparent focus-within:border-neutral-200 dark:focus-within:border-neutral-800 transition-colors">
                                                    {user.name}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Email</label>
                                                <div className="bg-neutral-100 dark:bg-neutral-900 px-6 py-4 rounded-2xl font-bold text-neutral-400 border border-transparent italic">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Phone Number</label>
                                            <div className="bg-neutral-100 dark:bg-neutral-900 px-6 py-4 rounded-2xl font-bold border border-transparent italic">
                                                {user.phone || "Not provided"}
                                            </div>
                                        </div>
                                        <div className="pt-8">
                                            <button className="bg-neutral-100 dark:bg-neutral-800 text-neutral-400 px-8 py-4 rounded-2xl font-black text-sm cursor-not-allowed opacity-50">
                                                Save Changes (Coming Soon)
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </main>
    );
}
