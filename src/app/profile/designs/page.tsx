"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wand2,
    ArrowLeft,
    Loader2,
    Trash2,
    Edit3,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/Shop/Breadcrumbs";
import { useConfirm } from "@/context/ConfirmContext";

interface DesignOrder {
    _id: string;
    name?: string;
    blankProduct: {
        _id: string;
        name: string;
    };
    thumbnail: string;
    createdAt: string;
    status: string;
}

export default function MyDesignsPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [designs, setDesigns] = useState<DesignOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();
    const confirm = useConfirm();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login?message=Please log in to view your designs.");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDesigns();
        }
    }, [isAuthenticated]);

    const fetchDesigns = async () => {
        try {
            const res = await fetch("/api/design-orders");
            if (res.ok) {
                const data = await res.json();
                setDesigns(data);
            }
        } catch (err) {
            console.error("Design fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name?: string) => {
        const confirmed = await confirm({
            title: "Delete Design?",
            message: `"${name || "This design"}" will be permanently removed and cannot be recovered.`,
            confirmLabel: "Delete",
            cancelLabel: "Keep it",
            variant: "danger",
        });
        if (!confirmed) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/design-orders/${id}`, { method: "DELETE" });
            if (res.ok) {
                setDesigns(prev => prev.filter(d => d._id !== id));
            } else {
                console.error("Delete failed:", await res.text());
            }
        } catch (err) {
            console.error("Delete error", err);
        } finally {
            setDeletingId(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-purple-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" /> Back to Profile
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">My Designs</h1>
                            <p className="text-muted-foreground font-medium">View and manage your custom product drafts.</p>
                        </div>
                        <Link href="/design" className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20">
                            <Plus className="w-4 h-4" /> Create New
                        </Link>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {designs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-16 text-center"
                        >
                            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mx-auto mb-6 rounded-3xl">
                                <Wand2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">No saved designs</h3>
                            <p className="text-muted-foreground mb-8 text-sm max-w-md mx-auto">
                                You haven&apos;t saved any designs yet. Head over to our shop, pick a product, and start creating!
                            </p>
                            <Link
                                href="/design"
                                className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-2xl font-black inline-flex items-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98]"
                            >
                                Start Designing
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {designs.map((design) => (
                                <motion.div
                                    key={design._id}
                                    layout
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all group"
                                >
                                    <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 relative group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/50 transition-colors">
                                        {design.thumbnail ? (
                                            <img src={design.thumbnail} alt={design.blankProduct?.name} className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                <Wand2 className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <Link
                                                href={`/design/${design.blankProduct?._id}?orderId=${design._id}`}
                                                className="bg-white text-black p-3 rounded-xl font-bold flex items-center gap-2 hover:scale-110 transition-transform"
                                            >
                                                <Edit3 className="w-4 h-4" /> Edit
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-black text-lg truncate leading-tight group-hover:text-purple-600 transition-colors">
                                                    {design.name || design.blankProduct?.name || "Custom Design"}
                                                </h4>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">
                                                    Saved on {new Date(design.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(design._id, design.name || design.blankProduct?.name)}
                                                disabled={deletingId === design._id}
                                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === design._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {design.status}
                                            </span>
                                            <Link
                                                href={`/design/${design.blankProduct?._id}?orderId=${design._id}`}
                                                className="text-sm font-black text-purple-600 hover:underline"
                                            >
                                                Continue Editing →
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
