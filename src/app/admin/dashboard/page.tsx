'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    ShoppingCart,
    TrendingUp,
    ArrowUpRight,
    Package,
    Activity,
    Loader2,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/dashboard/stats');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const iconMap: any = {
        Package,
        Users,
        TrendingUp,
        ShoppingCart
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse">Initializing Dashboard Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold tracking-tight mb-2"
                >
                    Dashboard Overview
                </motion.h1>
                <p className="text-gray-400">Welcome to your administrative command center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(data?.stats || []).map((stat: any, index: number) => {
                    const Icon = iconMap[stat.icon] || Activity;
                    return (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-3xl bg-gradient-to-br ${stat.color} border border-white/5 backdrop-blur-sm shadow-xl hover:border-white/10 transition-all group`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-white/5 ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                                    {stat.trend} <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{stat.name}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        Performance Analytics
                    </h3>
                    <div className="h-64 flex items-center justify-center rounded-2xl bg-white/2 border border-dashed border-white/10">
                        <p className="text-gray-500 italic text-sm">Visual reports are being processed and will appear as your store grows.</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {(data?.recentActivity || []).length === 0 ? (
                            <div className="py-10 text-center">
                                <Clock className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                                <p className="text-gray-500 text-xs">No recent activity detected.</p>
                            </div>
                        ) : (
                            data.recentActivity.map((activity: any, i: number) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                                    <div className="mt-1">
                                        <div className={cn(
                                            "w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]",
                                            activity.status === 'delivered' ? "bg-emerald-500" : "bg-blue-500"
                                        )} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                                            Order from {activity.user}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[10px] text-gray-500 font-medium">
                                                {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-[10px] font-black text-purple-500">
                                                {activity.amount}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
