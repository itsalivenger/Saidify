'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    Loader2,
    ToggleLeft,
    ToggleRight,
    AlertCircle,
    Image as ImageIcon,
    Upload
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useRef } from 'react';

interface Category {
    _id: string;
    name: string;
    slug: string;
    active: boolean;
    description?: string;
    image?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: { en: '', fr: '', ar: '' },
        active: true,
        description: { en: '', fr: '', ar: '' },
        image: ''
    });
    const [editingLang, setEditingLang] = useState<'en'|'fr'|'ar'>('en');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch('/api/categories', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                await fetchCategories();
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: { en: '', fr: '', ar: '' }, active: true, description: { en: '', fr: '', ar: '' }, image: '' });
            }
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchCategories();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat._id);
        setFormData({
            name: cat.name,
            active: cat.active,
            description: cat.description || '',
            image: cat.image || ''
        });
        setIsAdding(true);
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                alert('Upload failed. Please try again.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading image.');
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    return (
        <div className="space-y-10 max-w-6xl">
            <div className="flex justify-between items-center">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight mb-2"
                    >
                        Category Management
                    </motion.h1>
                    <p className="text-gray-400">Manage the categories used for filtering products in your boutique.</p>
                </div>

                {!isAdding && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setIsAdding(true);
                            setEditingId(null);
                            setFormData({ name: { en: '', fr: '', ar: '' }, active: true, description: { en: '', fr: '', ar: '' }, image: '' });
                        }}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-xl transition-all shadow-lg shadow-purple-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold capitalize">
                                {editingId ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        
                        <div className="flex justify-between items-center bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 w-fit mb-6">
                            {[
                                { id: 'en', label: 'English' },
                                { id: 'fr', label: 'Français' },
                                { id: 'ar', label: 'العربية' },
                            ].map((lang) => (
                                <button
                                    key={lang.id}
                                    type="button"
                                    onClick={() => setEditingLang(lang.id as 'en'|'fr'|'ar')}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all",
                                        editingLang === lang.id
                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                                            : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    <Globe className="w-4 h-4" />
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Name ({editingLang.toUpperCase()})</label>
                                <input
                                    type="text"
                                    required={editingLang === 'en'}
                                    value={formData.name?.[editingLang] || ''}
                                    onChange={(e) => setFormData({ ...formData, name: { ...(formData.name || {}), [editingLang]: e.target.value } })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="e.g. Winter Collection"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Status</label>
                                <div className="flex items-center h-[52px]">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, active: !formData.active })}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${formData.active
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}
                                    >
                                        {formData.active ? <ToggleRight /> : <ToggleLeft />}
                                        {formData.active ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Description ({editingLang.toUpperCase()})</label>
                                <textarea
                                    rows={2}
                                    value={formData.description?.[editingLang] || ''}
                                    onChange={(e) => setFormData({ ...formData, description: { ...(formData.description || {}), [editingLang]: e.target.value } })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                    placeholder="Brief description of this category..."
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Category Image</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <div className="flex gap-4 items-start">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            "flex-1 aspect-[21/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                                            formData.image
                                                ? "bg-neutral-900 border-neutral-800"
                                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50"
                                        )}
                                    >
                                        {formData.image ? (
                                            <div className="relative w-full h-full p-2 group">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                                                    <Edit2 className="w-5 h-5" />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {uploading ? <Loader2 className="w-6 h-6 animate-spin text-purple-500" /> : <Upload className="w-6 h-6 text-gray-500" />}
                                                <p className="text-xs text-gray-500 font-medium">Click to upload collection banner</p>
                                            </>
                                        )}
                                    </div>
                                    {formData.image && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all shadow-lg shadow-red-500/5"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-8 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading || uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    {editingId ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <motion.div
                        key={cat._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/5 blur-[40px] rounded-full group-hover:bg-purple-600/10 transition-all" />

                        <div className="mb-4">
                            <div className="aspect-[21/9] rounded-xl overflow-hidden mb-4 bg-neutral-900 border border-white/5 relative">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-purple-600/5">
                                        <Tag className="w-8 h-8 text-purple-500/20" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button
                                        onClick={() => startEdit(cat)}
                                        className="p-1.5 bg-black/60 text-white/70 hover:text-white hover:bg-black/80 backdrop-blur-md rounded-lg transition-all border border-white/10"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/40 backdrop-blur-md rounded-lg transition-all border border-red-500/20"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-xl">{cat.name}</h3>
                                {!cat.active && (
                                    <span className="flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 font-bold uppercase tracking-wider">
                                        <AlertCircle className="w-3 h-3" />
                                        Hidden
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 truncate mb-1">/{cat.slug}</p>
                            <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">
                                {cat.description || 'No description provided.'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {categories.length === 0 && !loading && (
                <div className="text-center py-20">
                    <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-500">No categories found.</p>
                    <p className="text-gray-600 mt-2">Start by adding your first product category.</p>
                </div>
            )}

            {loading && categories.length === 0 && (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
            )}
        </div>
    );
}
