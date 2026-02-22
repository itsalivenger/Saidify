'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Package,
    Wand2,
    Plus,
    Pencil,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    Eye,
    EyeOff,
    AlertCircle,
    Image as ImageIcon,
    Layers
} from 'lucide-react';

interface BlankProduct {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    variants: any[];
    views: any[];
    active: boolean;
    allowText: boolean;
    createdAt: string;
}

export default function BlankProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<BlankProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/blanks?admin=true');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error('Failed to fetch blank products', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleToggleActive = async (product: BlankProduct) => {
        try {
            await fetch(`/api/blanks/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !product.active }),
            });
            fetchProducts();
        } catch (err) {
            console.error('Toggle error', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this blank product? This cannot be undone.')) return;
        setDeletingId(id);
        try {
            await fetch(`/api/blanks/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (err) {
            console.error('Delete error', err);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black mb-2">Blank Products</h1>
                    <p className="text-muted-foreground">Manage customizable product templates for the Design Studio.</p>
                </div>
                <Link
                    href="/admin/dashboard/blanks/new"
                    className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Blank Product
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Products', value: products.length, icon: Package, color: 'purple' },
                    { label: 'Active', value: products.filter(p => p.active).length, icon: Eye, color: 'emerald' },
                    { label: 'Inactive', value: products.filter(p => !p.active).length, icon: EyeOff, color: 'amber' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6">
                        <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${stat.color === 'purple' ? 'bg-purple-500/10 text-purple-600' :
                                stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600' :
                                    'bg-amber-500/10 text-amber-600'
                            }`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-3xl font-black">{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
                    <Wand2 className="w-12 h-12 text-neutral-300 mb-4" />
                    <h3 className="text-lg font-bold text-neutral-500">No blank products yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-5">Create your first customizable product to open the Design Studio.</p>
                    <Link href="/admin/dashboard/blanks/new" className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm">
                        Create First Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden hover:shadow-lg transition-all group"
                        >
                            {/* Mockup Preview */}
                            <div className="relative h-48 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden">
                                {product.views[0]?.mockupImage ? (
                                    <img
                                        src={product.views[0].mockupImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                        <ImageIcon className="w-10 h-10" />
                                        <span className="text-xs font-medium">No mockup yet</span>
                                    </div>
                                )}
                                {/* Active badge */}
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${product.active ? 'bg-emerald-500/20 text-emerald-600' : 'bg-neutral-200 text-neutral-500'
                                    }`}>
                                    {product.active ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-black text-lg leading-tight">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{product.description || 'No description'}</p>
                                    </div>
                                    <span className="text-lg font-black text-purple-600 ml-3 flex-shrink-0">{product.basePrice} MAD</span>
                                </div>

                                {/* Metadata chips */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Chip icon={Package} label={`${product.variants.length} variant${product.variants.length !== 1 ? 's' : ''}`} />
                                    <Chip icon={Layers} label={`${product.views.length} view${product.views.length !== 1 ? 's' : ''}`} />
                                    {product.allowText && <Chip icon={Wand2} label="Text layers" />}
                                </div>

                                {/* Print zones summary */}
                                {product.views.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {product.views.map(v => (
                                            <span key={v.name} className="text-xs px-2 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                                                {v.name}: {v.printZones?.length || 0} zone{v.printZones?.length !== 1 ? 's' : ''}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <Link
                                        href={`/admin/dashboard/blanks/${product._id}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600/10 text-purple-700 dark:text-purple-300 hover:bg-purple-600/20 transition-colors font-bold text-sm"
                                    >
                                        <Pencil className="w-4 h-4" /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleToggleActive(product)}
                                        className={`px-3 py-2.5 rounded-xl transition-colors ${product.active ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                            }`}
                                        title={product.active ? 'Deactivate' : 'Activate'}
                                    >
                                        {product.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        disabled={deletingId === product._id}
                                        className="px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
                                        title="Delete"
                                    >
                                        {deletingId === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

function Chip({ icon: Icon, label }: { icon: any; label: string }) {
    return (
        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-neutral-100 dark:bg-white/5 rounded-full text-muted-foreground font-medium">
            <Icon className="w-3 h-3" /> {label}
        </span>
    );
}
