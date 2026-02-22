'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    ShoppingCart,
    Package,
    Mail,
    Calendar,
    ArrowUpRight
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

export default function ClientsPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('/api/admin/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    setError(errorData.message || 'Failed to fetch users');
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
                setError('A network error occurred while fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2">Customer Base</h1>
                    <p className="text-muted-foreground">Manage your users, their carts, and order history.</p>
                </div>

                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-medium"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-6 rounded-3xl mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">!</div>
                    <div>
                        <h3 className="font-bold">Error loading customers</h3>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 rounded-3xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
                    ))}
                </div>
            ) : error ? null : filteredUsers.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                    <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">No customers found</h3>
                    <p className="text-muted-foreground">Try adjusting your search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 hover:shadow-2xl hover:shadow-purple-500/5 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex items-center justify-center border border-purple-500/20">
                                    <span className="text-lg font-black text-purple-600">
                                        {user.name?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {user.cart?.length > 0 && (
                                        <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            Active Cart
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <h3 className="text-lg font-black group-hover:text-purple-500 transition-colors">{user.name || 'Anonymous User'}</h3>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 py-4 border-y border-neutral-50 dark:border-neutral-800">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                                            <ShoppingCart className="w-3 h-3" /> Cart
                                        </div>
                                        <p className="text-lg font-black">{user.cart?.length || 0} <span className="text-xs font-medium text-neutral-500">items</span></p>
                                    </div>
                                    <div className="w-px h-8 bg-neutral-100 dark:bg-neutral-800" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                                            <Calendar className="w-3 h-3" /> Member
                                        </div>
                                        <p className="text-lg font-black">{user.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/admin/dashboard/clients/${user._id}`}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-50 dark:bg-white/5 rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-all transform active:scale-[0.98]"
                            >
                                View History <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
