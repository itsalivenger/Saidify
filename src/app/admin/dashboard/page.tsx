'use client';

import { motion } from 'framer-motion';
import {
    Users,
    ShoppingCart,
    TrendingUp,
    ArrowUpRight,
    Package,
    Activity
} from 'lucide-react';

export default function AdminDashboardPage() {
    const stats = [
        { name: 'Total Products', value: '1,234', icon: Package, color: 'from-blue-600/20 to-blue-600/5', iconColor: 'text-blue-500', trend: '+12.5%' },
        { name: 'Active Users', value: '56', icon: Users, color: 'from-purple-600/20 to-purple-600/5', iconColor: 'text-purple-500', trend: '+3.2%' },
        { name: 'Weekly Revenue', value: '12,450 MAD', icon: TrendingUp, color: 'from-emerald-600/20 to-emerald-600/5', iconColor: 'text-emerald-500', trend: '+18.7%' },
        { name: 'System Status', value: 'Healthy', icon: Activity, color: 'from-orange-600/20 to-orange-600/5', iconColor: 'text-orange-500', trend: 'Stable' },
    ];

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
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-3xl bg-gradient-to-br ${stat.color} border border-white/5 backdrop-blur-sm shadow-xl hover:border-white/10 transition-all group`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-white/5 ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
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
                ))}
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
                        <p className="text-gray-500 italic">Chart visualization will be rendered here.</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Recent Logs
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <div>
                                    <p className="text-sm font-medium">Internal server ping successful</p>
                                    <p className="text-[10px] text-gray-500 mt-1">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
