'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Plus,
    Image as ImageIcon,
    Tag,
    Layers,
    FileText,
    CheckCircle2,
    Loader2,
    Settings,
    Upload,
    X,
    Coins,
    Edit2,
    Trash2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProductPage() {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const editId = searchParams?.get('edit');

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState<{ name: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        image: '',
        description: '',
        stock: '',
        sizes: [] as string[],
        colors: [] as { name: string, value: string }[],
    });

    const [hasSizes, setHasSizes] = useState(false);
    const [newColor, setNewColor] = useState({ name: '', value: '#000000' });

    const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const catRes = await fetch('/api/categories');
                let activeCategories = [];
                if (catRes.ok) {
                    const data = await catRes.json();
                    activeCategories = data.filter((cat: any) => cat.active);
                    setCategories(activeCategories);
                }

                if (editId) {
                    setLoading(true);
                    const prodRes = await fetch(`/api/products/${editId}`);
                    if (prodRes.ok) {
                        const product = await prodRes.json();
                        setFormData({
                            title: product.title,
                            price: product.price.toString(),
                            category: product.category,
                            image: product.image,
                            description: product.description || '',
                            stock: product.stock.toString(),
                            sizes: product.sizes || [],
                            colors: product.colors || []
                        });
                        setHasSizes(product.sizes?.length > 0);
                    }
                } else if (activeCategories.length > 0) {
                    setFormData(prev => ({ ...prev, category: activeCategories[0].name }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [editId]);

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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            uploadFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            alert('Please upload an image first');
            return;
        }
        setLoading(true);

        try {
            const url = editId ? `/api/products/${editId}` : '/api/products';
            const method = editId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock) || 0,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    if (editId) {
                        router.push('/admin/dashboard/products/master');
                    } else {
                        setFormData({
                            title: '',
                            price: '',
                            category: categories.length > 0 ? categories[0].name : '',
                            image: '',
                            description: '',
                            stock: '',
                            sizes: [],
                            colors: []
                        });
                        setHasSizes(false);
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 max-w-4xl">
            <div className="flex justify-between items-start">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight mb-2"
                    >
                        {editId ? 'Edit Product' : 'Add New Product'}
                    </motion.h1>
                    <p className="text-gray-400">
                        {editId ? 'Modify the details of this item in your catalog.' : 'Fill in the details below to add a new item to your boutique.'}
                    </p>
                </div>
                <Link href="/admin/dashboard/products/master">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-4 py-2 rounded-xl border border-white/10 transition-all text-sm font-medium"
                    >
                        <Settings className="w-4 h-4" />
                        Inventory Master
                    </motion.button>
                </Link>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8"
            >
                {loading && editId ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                    </div>
                ) : (
                    <>
                        {/* Main Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Product Title</label>
                                <div className="relative group">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                        placeholder="Summer Floral Dress"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Price (MAD)</label>
                                <div className="relative group">
                                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                        placeholder="950.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Category</label>
                                <div className="relative group">
                                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.name} value={cat.name} className="bg-[#1a1a1a] text-white">{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Stock Quantity</label>
                                <div className="relative group">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                        placeholder="50"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Media */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Product Image</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            <AnimatePresence mode="wait">
                                {!formData.image ? (
                                    <motion.div
                                        key="upload-area"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={cn(
                                            "w-full aspect-[16/5] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer",
                                            isDragging
                                                ? "bg-purple-500/10 border-purple-500 scale-[1.01] shadow-xl shadow-purple-500/10"
                                                : "bg-white/5 border-white/10 group hover:bg-white/11 hover:border-purple-500/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-4 rounded-full transition-all",
                                            isDragging ? "bg-purple-500 text-white" : "bg-white/5 group-hover:bg-purple-500/10 group-hover:text-purple-500"
                                        )}>
                                            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">{isDragging ? "Drop your image here" : "Click or drag your image here"}</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="image-preview"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="relative group aspect-[16/5] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                                    >
                                        <img src={formData.image} alt="Upload preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
                                            >
                                                <Edit2 className="w-6 h-6" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-500 backdrop-blur-md transition-all"
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Description</label>
                            <div className="relative group">
                                <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                                    placeholder="Describe the product details, materials, fit..."
                                />
                            </div>
                        </div>

                        {/* Variants (Sizes & Colors) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-gray-300">Available Sizes</label>
                                    <button
                                        type="button"
                                        onClick={() => setHasSizes(!hasSizes)}
                                        className={cn(
                                            "text-xs px-3 py-1 rounded-full border transition-all",
                                            hasSizes ? "bg-purple-500/20 border-purple-500 text-purple-400" : "bg-white/5 border-white/10 text-gray-500"
                                        )}
                                    >
                                        {hasSizes ? "Disable Sizes" : "Enable Sizes"}
                                    </button>
                                </div>

                                {hasSizes && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {AVAILABLE_SIZES.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    const sizes = formData.sizes.includes(size)
                                                        ? formData.sizes.filter(s => s !== size)
                                                        : [...formData.sizes, size];
                                                    setFormData({ ...formData, sizes });
                                                }}
                                                className={cn(
                                                    "w-12 h-12 rounded-xl border-2 font-bold transition-all",
                                                    formData.sizes.includes(size)
                                                        ? "border-purple-500 bg-purple-500/20 text-white"
                                                        : "border-white/5 bg-white/5 text-gray-500 hover:border-white/20"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-300">Available Colors</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name (e.g. Black)"
                                        value={newColor.name}
                                        onChange={e => setNewColor({ ...newColor, name: e.target.value })}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                    <input
                                        type="color"
                                        value={newColor.value}
                                        onChange={e => setNewColor({ ...newColor, value: e.target.value })}
                                        className="w-12 h-10 bg-transparent border-0 rounded cursor-pointer"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newColor.name) {
                                                setFormData({ ...formData, colors: [...formData.colors, newColor] });
                                                setNewColor({ name: '', value: '#000000' });
                                            }
                                        }}
                                        className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10"
                                    >
                                        <Plus className="w-5 h-5 text-purple-500" />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                    <AnimatePresence>
                                        {formData.colors.map((color, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-1 pr-3 py-1 group"
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-full border border-white/20"
                                                    style={{ backgroundColor: color.value }}
                                                />
                                                <span className="text-xs font-medium text-gray-300">{color.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== index) })}
                                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading || uploading}
                                type="submit"
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        {editId ? 'Update Product' : 'Create Product'}
                                    </>
                                )}
                            </motion.button>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-emerald-400 font-medium"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Product {editId ? 'updated' : 'added'} successfully!
                                </motion.div>
                            )}
                        </div>
                    </>
                )}
            </motion.form>
        </div>
    );
}
