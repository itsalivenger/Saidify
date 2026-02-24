'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Save,
    Upload,
    Loader2,
    Image as ImageIcon,
    Type,
    Star,
    Plus,
    Trash2,
    Check,
    Megaphone,
    Mail,
    RefreshCw,
    Settings,
    Phone,
    MapPin,
    Globe,
    Target,
    History,
    Heart,
    Users,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Search,
    Zap,
    Package,
    ArrowUpRight,
    Tag,
    PackagePlus,
    Clock,
    Award,
    Instagram,
    Twitter,
    Linkedin,
    Facebook,
} from 'lucide-react';
import { cn } from "@/lib/utils";

const ICONS = ['Leaf', 'Award', 'Heart', 'ShieldCheck', 'Users', 'Target', 'Globe', 'Zap', 'Star', 'Smile'];

const TABS = [
    { id: 'home', label: 'Home Page', icon: Layout },
    { id: 'about', label: 'About Page', icon: Users },
    { id: 'collections', label: 'Collections', icon: Package },
    { id: 'general', label: 'General Settings', icon: Settings },
];

interface Product {
    _id: string;
    title: string;
    image: string;
    category: string;
    isBestSeller: boolean;
    isNewArrival: boolean;
    featured: boolean;
}

interface Category {
    _id: string;
    name: string;
    image?: string;
}

export default function WebsiteControlPage() {
    const [activeTab, setActiveTab] = useState('home');
    const [activeAboutSection, setActiveAboutSection] = useState<'mission' | 'story' | 'values' | 'team'>('mission');
    const [settings, setSettings] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [productLoading, setProductLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUploadField = useRef<string | null>(null);

    useEffect(() => {
        fetchSettings();
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();

                // Initialize aboutPage if missing or incomplete
                if (!data.aboutPage) {
                    data.aboutPage = {
                        mission: { badge: "Our Mission", title: "Redefining modern luxury for everyone.", description: "...", bgImage: "" },
                        story: { title: "Our Journey", timeline: [] },
                        values: [],
                        team: { title: "Meet the Team", subtitle: "...", members: [] }
                    };
                } else {
                    if (!data.aboutPage.mission) data.aboutPage.mission = { badge: "", title: "", description: "", bgImage: "" };
                    if (!data.aboutPage.story) data.aboutPage.story = { title: "", timeline: [] };
                    if (!data.aboutPage.values) data.aboutPage.values = [];
                    if (!data.aboutPage.team) data.aboutPage.team = { title: "", subtitle: "", members: [] };
                }

                setSettings(data);
            }
        } catch (err) {
            console.error('Error fetching settings', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setProductLoading(true);
        try {
            const res = await fetch('/api/products?limit=100');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setProductLoading(false);
        }
    };

    const handleSave = async (section: string) => {
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('adminToken');
            const payload: any = {};

            if (section === 'homepage') payload['homepage'] = settings.homepage;
            if (section === 'aboutPage') payload['aboutPage'] = settings.aboutPage;
            if (section === 'mainSettings') {
                payload['mainSettings.siteName'] = settings.mainSettings.siteName;
                payload['mainSettings.logo'] = settings.mainSettings.logo;
                payload['mainSettings.contactEmail'] = settings.mainSettings.contactEmail;
                payload['mainSettings.contactPhone'] = settings.mainSettings.contactPhone;
                payload['mainSettings.whatsappNumber'] = settings.mainSettings.whatsappNumber;
                payload['mainSettings.address'] = settings.mainSettings.address;
                payload['mainSettings.socialLinks'] = settings.mainSettings.socialLinks;
            }

            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: `${section === 'homepage' ? 'Home' : section === 'aboutPage' ? 'About' : 'General'} settings saved successfully!` });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: `Error: ${data.message || res.statusText}` });
            }
        } catch (err) {
            console.error('Save error', err);
            setMessage({ type: 'error', text: 'An unexpected error occurred during save.' });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingField(field);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (res.ok) {
                const data = await res.json();
                const url = data.url;
                setSettings((prev: any) => {
                    const updated = { ...prev };
                    if (field === 'hero.image') updated.homepage.hero.image = url;
                    if (field === 'promo.image') updated.homepage.promoBanner.image = url;
                    if (field === 'mainSettings.logo') updated.mainSettings.logo = url;
                    if (field === 'about.mission.bgImage') updated.aboutPage.mission.bgImage = url;
                    return updated;
                });
            }
        } catch (err) {
            console.error('Upload error', err);
        } finally {
            setUploadingField(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Helper functions for updating state
    const updateHero = (key: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            homepage: { ...prev.homepage, hero: { ...prev.homepage.hero, [key]: value } }
        }));
    };

    const updatePromo = (key: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            homepage: { ...prev.homepage, promoBanner: { ...prev.homepage.promoBanner, [key]: value } }
        }));
    };

    const updateNewsletter = (key: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            homepage: { ...prev.homepage, newsletter: { ...prev.homepage.newsletter, [key]: value } }
        }));
    };

    const addTestimonial = () => {
        setSettings((prev: any) => ({
            ...prev,
            homepage: {
                ...prev.homepage,
                testimonials: [
                    ...prev.homepage.testimonials,
                    { author: '', role: '', content: '', rating: 5 }
                ]
            }
        }));
    };

    const updateTestimonial = (index: number, key: string, value: any) => {
        setSettings((prev: any) => {
            const updated = [...prev.homepage.testimonials];
            updated[index] = { ...updated[index], [key]: value };
            return { ...prev, homepage: { ...prev.homepage, testimonials: updated } };
        });
    };

    const removeTestimonial = (index: number) => {
        setSettings((prev: any) => {
            const updated = prev.homepage.testimonials.filter((_: any, i: number) => i !== index);
            return { ...prev, homepage: { ...prev.homepage, testimonials: updated } };
        });
    };

    const updateGeneral = (key: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            mainSettings: { ...(prev?.mainSettings || {}), [key]: value }
        }));
    };

    const updateSocial = (key: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            mainSettings: {
                ...(prev?.mainSettings || {}),
                socialLinks: { ...(prev?.mainSettings?.socialLinks || {}), [key]: value }
            }
        }));
    };

    // About Page Helpers
    const updateAboutNested = (section: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            aboutPage: {
                ...prev.aboutPage,
                [section]: {
                    ...prev.aboutPage[section],
                    [field]: value
                }
            }
        }));
    };

    const addAboutItem = (section: 'story' | 'values' | 'team', defaultValue: any) => {
        setSettings((prev: any) => {
            const aboutPage = { ...prev.aboutPage };
            if (section === 'story') {
                aboutPage.story.timeline = [...aboutPage.story.timeline, defaultValue];
            } else if (section === 'values') {
                aboutPage.values = [...aboutPage.values, defaultValue];
            } else if (section === 'team') {
                aboutPage.team.members = [...aboutPage.team.members, defaultValue];
            }
            return { ...prev, aboutPage };
        });
    };

    const removeAboutItem = (section: 'story' | 'values' | 'team', index: number) => {
        setSettings((prev: any) => {
            const aboutPage = { ...prev.aboutPage };
            if (section === 'story') {
                aboutPage.story.timeline = aboutPage.story.timeline.filter((_: any, i: number) => i !== index);
            } else if (section === 'values') {
                aboutPage.values = aboutPage.values.filter((_: any, i: number) => i !== index);
            } else if (section === 'team') {
                aboutPage.team.members = aboutPage.team.members.filter((_: any, i: number) => i !== index);
            }
            return { ...prev, aboutPage };
        });
    };

    const updateAboutItem = (section: 'story' | 'values' | 'team', index: number, field: string, value: any) => {
        setSettings((prev: any) => {
            const aboutPage = { ...prev.aboutPage };
            if (section === 'story') {
                aboutPage.story.timeline[index] = { ...aboutPage.story.timeline[index], [field]: value };
            } else if (section === 'values') {
                aboutPage.values[index] = { ...aboutPage.values[index], [field]: value };
            } else if (section === 'team') {
                aboutPage.team.members[index] = { ...aboutPage.team.members[index], [field]: value };
            }
            return { ...prev, aboutPage };
        });
    };

    const toggleProductStatus = async (productId: string, field: string, currentValue: boolean) => {
        setUpdatingProductId(`${productId}-${field}`);
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: !currentValue })
            });

            if (res.ok) {
                setProducts(products.map(p =>
                    p._id === productId ? { ...p, [field]: !currentValue } : p
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingProductId(null);
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
        <div className="p-8 max-w-5xl mx-auto pb-32">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => currentUploadField.current && handleImageUpload(e, currentUploadField.current)}
            />

            {/* Header */}
            <div className="mb-10 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black mb-2">Website Control</h1>
                    <p className="text-muted-foreground">Manage your storefront's content and appearance.</p>
                </div>
                {/* Save Button is now sticky at the bottom but we can keep a primary one here if needed or just use the floating one */}
            </div>

            {/* Notification */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                            "mb-6 p-4 rounded-2xl flex items-center gap-3 border shadow-lg font-bold sticky top-4 z-[60]",
                            message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Tabs */}
            <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 w-fit mb-10">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all",
                            activeTab === tab.id
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                                : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Tabs */}
            <AnimatePresence mode="wait">
                {activeTab === 'home' && settings && (
                    <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                        <SectionCard title="Hero Section" description="The main banner at the top of the homepage.">
                            <div>
                                <Label>Hero Image</Label>
                                <div
                                    className="relative mt-2 aspect-video w-full max-w-lg rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-pointer group hover:border-purple-500/50 transition-all"
                                    onClick={() => { currentUploadField.current = 'hero.image'; fileInputRef.current?.click(); }}
                                >
                                    {settings.homepage.hero.image ? (
                                        <img src={settings.homepage.hero.image} alt="Hero" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                            <ImageIcon className="w-10 h-10" />
                                            <p className="text-sm font-medium">Click to upload hero image</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {uploadingField === 'hero.image' ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white" />}
                                    </div>
                                </div>
                            </div>
                            <Field label="Badge Text" value={settings.homepage.hero.badge} onChange={(v) => updateHero('badge', v)} placeholder="e.g. New Collection 2024" />
                            <Field label="Main Title" value={settings.homepage.hero.title} onChange={(v) => updateHero('title', v)} placeholder="Enter the hero headline" multiline />
                            <Field label="Subtitle" value={settings.homepage.hero.subtitle} onChange={(v) => updateHero('subtitle', v)} placeholder="Enter the supporting text" multiline />
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Primary CTA Button" value={settings.homepage.hero.ctaPrimary} onChange={(v) => updateHero('ctaPrimary', v)} placeholder="e.g. Shop Now" />
                                <Field label="Secondary CTA Button" value={settings.homepage.hero.ctaSecondary} onChange={(v) => updateHero('ctaSecondary', v)} placeholder="e.g. Explore Collection" />
                            </div>
                        </SectionCard>

                        <SectionCard title="Promo Banner" description="The promotional section with a countdown timer.">
                            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-white/5 rounded-2xl">
                                <div>
                                    <p className="font-bold">Show Promo Banner</p>
                                    <p className="text-sm text-muted-foreground">Toggle visibility on the homepage</p>
                                </div>
                                <button
                                    onClick={() => updatePromo('active', !settings.homepage.promoBanner.active)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.homepage.promoBanner.active ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${settings.homepage.promoBanner.active ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                            <div>
                                <Label>Background Image</Label>
                                <div
                                    className="relative mt-2 aspect-video w-full max-w-lg rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-pointer group hover:border-purple-500/50 transition-all"
                                    onClick={() => { currentUploadField.current = 'promo.image'; fileInputRef.current?.click(); }}
                                >
                                    {settings.homepage.promoBanner.image ? (
                                        <img src={settings.homepage.promoBanner.image} alt="Promo BG" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                            <ImageIcon className="w-10 h-10" />
                                            <p className="text-sm font-medium">Click to upload background image</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {uploadingField === 'promo.image' ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white" />}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Main Title" value={settings.homepage.promoBanner.title} onChange={(v) => updatePromo('title', v)} placeholder="e.g. End of Season" />
                                <Field label="Subtitle / Highlight" value={settings.homepage.promoBanner.subtitle} onChange={(v) => updatePromo('subtitle', v)} placeholder="e.g. Clearance Sale" />
                            </div>
                            <Field label="Description" value={settings.homepage.promoBanner.description} onChange={(v) => updatePromo('description', v)} placeholder="Enter the promotional description" multiline />
                            <Field label="CTA Button Text" value={settings.homepage.promoBanner.ctaText} onChange={(v) => updatePromo('ctaText', v)} placeholder="e.g. Shop The Sale" />
                        </SectionCard>

                        <SectionCard title="Newsletter Section" description="The email subscription section at the bottom of the homepage.">
                            <Field label="Headline" value={settings.homepage.newsletter.title} onChange={(v) => updateNewsletter('title', v)} placeholder="e.g. Join the Club" />
                            <Field label="Subtitle" value={settings.homepage.newsletter.subtitle} onChange={(v) => updateNewsletter('subtitle', v)} placeholder="Enter the newsletter subtext" multiline />
                        </SectionCard>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h2 className="text-2xl font-black">Testimonials</h2>
                                    <p className="text-muted-foreground text-sm">Manage customer reviews displayed on the homepage.</p>
                                </div>
                                <button onClick={addTestimonial} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors">
                                    <Plus className="w-4 h-4" /> Add Review
                                </button>
                            </div>
                            {settings.homepage.testimonials.map((t: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 space-y-4 shadow-sm group relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} onClick={() => updateTestimonial(i, 'rating', star)}>
                                                    <Star className={`w-5 h-5 ${star <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => removeTestimonial(i)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <Field label="Review Text" value={t.content} onChange={(v) => updateTestimonial(i, 'content', v)} placeholder="What did the customer say?" multiline />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Author Name" value={t.author} onChange={(v) => updateTestimonial(i, 'author', v)} placeholder="e.g. Alex Morgan" />
                                        <Field label="Role / Title" value={t.role} onChange={(v) => updateTestimonial(i, 'role', v)} placeholder="e.g. Verified Buyer" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <SectionCard title="Home Page Categories" description="Select up to 4 categories to display on the home page.">
                            <div className="space-y-6">
                                <Label>Selected Categories ({settings.homepage.selectedCategories?.length || 0}/4)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {categories.map((cat) => {
                                        const isSelected = settings.homepage.selectedCategories?.includes(cat._id);
                                        return (
                                            <button
                                                key={cat._id}
                                                onClick={() => {
                                                    const currentSelected = settings.homepage.selectedCategories || [];
                                                    if (isSelected) {
                                                        setSettings({
                                                            ...settings,
                                                            homepage: {
                                                                ...settings.homepage,
                                                                selectedCategories: currentSelected.filter((id: string) => id !== cat._id)
                                                            }
                                                        });
                                                    } else if (currentSelected.length < 4) {
                                                        setSettings({
                                                            ...settings,
                                                            homepage: {
                                                                ...settings.homepage,
                                                                selectedCategories: [...currentSelected, cat._id]
                                                            }
                                                        });
                                                    }
                                                }}
                                                className={cn(
                                                    "relative aspect-[4/3] rounded-2xl border-2 transition-all p-2 flex flex-col items-center justify-center gap-2 group",
                                                    isSelected
                                                        ? "border-purple-500 bg-purple-500/10"
                                                        : "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-white/5 hover:border-purple-500/30"
                                                )}
                                            >
                                                {cat.image ? (
                                                    <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                                                        <Tag className="w-6 h-6 text-neutral-400" />
                                                    </div>
                                                )}
                                                <p className={cn("text-[10px] font-black uppercase text-center truncate w-full", isSelected ? "text-purple-600 dark:text-purple-400" : "text-neutral-500")}>
                                                    {cat.name}
                                                </p>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1 shadow-lg">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {categories.length === 0 && <p className="text-xs text-muted-foreground italic">No categories found. Add categories in Products {" > "} Categories.</p>}
                            </div>
                        </SectionCard>

                        <SaveButton onClick={() => handleSave('homepage')} saving={saving} label="Save Home Page" />
                    </motion.div>
                )}

                {activeTab === 'about' && settings && (
                    <motion.div key="about" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
                        {/* Sub-Tabs for About Section */}
                        <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-100 dark:bg-white/5 rounded-2xl border border-neutral-200 dark:border-white/10 w-fit">
                            {[
                                { id: 'mission', label: 'Mission', icon: Target },
                                { id: 'story', label: 'Our Story', icon: History },
                                { id: 'values', label: 'Values', icon: Heart },
                                { id: 'team', label: 'Team', icon: Users },
                            ].map((subTab) => (
                                <button
                                    key={subTab.id}
                                    onClick={() => setActiveAboutSection(subTab.id as any)}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-black transition-all",
                                        activeAboutSection === subTab.id
                                            ? "bg-white dark:bg-neutral-800 text-purple-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    )}
                                >
                                    <subTab.icon className="w-3.5 h-3.5" />
                                    {subTab.label}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-8 shadow-sm">
                            {/* About - Mission */}
                            {activeAboutSection === 'mission' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <Field label="Badge Text" value={settings.aboutPage.mission.badge} onChange={(v) => updateAboutNested('mission', 'badge', v)} placeholder="e.g. Our Mission" />
                                            <Field label="Hero Title" value={settings.aboutPage.mission.title} onChange={(v) => updateAboutNested('mission', 'title', v)} placeholder="Main headline..." />
                                            <div>
                                                <Label>Mission BG Image</Label>
                                                <div
                                                    className="relative mt-2 aspect-video w-full rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-pointer group hover:border-purple-500/50 transition-all bg-neutral-50 dark:bg-white/5"
                                                    onClick={() => { currentUploadField.current = 'about.mission.bgImage'; fileInputRef.current?.click(); }}
                                                >
                                                    {settings.aboutPage.mission.bgImage ? (
                                                        <img src={settings.aboutPage.mission.bgImage} alt="Mission BG" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                                            <ImageIcon className="w-10 h-10" />
                                                            <p className="text-xs font-medium">Upload mission background</p>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {uploadingField === 'about.mission.bgImage' ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Field label="Mission Description" value={settings.aboutPage.mission.description} onChange={(v) => updateAboutNested('mission', 'description', v)} placeholder="Tell your mission..." multiline />
                                    </div>
                                </div>
                            )}

                            {/* About - Story */}
                            {activeAboutSection === 'story' && (
                                <div className="space-y-8">
                                    <Field label="Section Title" value={settings.aboutPage.story.title} onChange={(v) => updateAboutNested('story', 'title', v)} placeholder="Our Journey..." />
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Timeline Events</label>
                                        {settings.aboutPage.story.timeline.map((item: any, idx: number) => (
                                            <div key={idx} className="p-6 bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 rounded-3xl flex flex-col md:flex-row gap-6 items-start relative group shadow-sm">
                                                <div className="w-24 shrink-0">
                                                    <input
                                                        type="text"
                                                        value={item.year}
                                                        onChange={(e) => updateAboutItem('story', idx, 'year', e.target.value)}
                                                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-black text-center text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all shadow-sm"
                                                        placeholder="Year"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => updateAboutItem('story', idx, 'title', e.target.value)}
                                                        className="w-full bg-transparent border-none text-foreground font-black text-lg p-0 focus:ring-0"
                                                        placeholder="Event Title..."
                                                    />
                                                    <textarea
                                                        value={item.description}
                                                        onChange={(e) => updateAboutItem('story', idx, 'description', e.target.value)}
                                                        className="w-full bg-transparent border-none text-muted-foreground text-sm p-0 focus:ring-0 resize-none"
                                                        placeholder="Description..."
                                                        rows={2}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removeAboutItem('story', idx)}
                                                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addAboutItem('story', { year: '2025', title: 'New Event', description: '' })}
                                            className="w-full border-2 border-dashed border-neutral-200 dark:border-white/5 rounded-3xl py-8 text-muted-foreground font-bold flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-white/5 hover:border-purple-500/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                                        >
                                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add Timeline Milestone
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* About - Values */}
                            {activeAboutSection === 'values' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {settings.aboutPage.values.map((value: any, idx: number) => (
                                            <div key={idx} className="p-6 bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 rounded-3xl space-y-4 group relative shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:bg-purple-600 transition-all border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                                        <select
                                                            value={value.iconName}
                                                            onChange={(e) => updateAboutItem('values', idx, 'iconName', e.target.value)}
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        >
                                                            {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                                        </select>
                                                        <span className="text-xs font-black group-hover:text-white transition-colors">{value.iconName[0]}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={value.title}
                                                            onChange={(e) => updateAboutItem('values', idx, 'title', e.target.value)}
                                                            className="w-full bg-transparent border-none text-foreground font-black p-0 focus:ring-0"
                                                            placeholder="Value Title..."
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeAboutItem('values', idx)}
                                                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <textarea
                                                    value={value.description}
                                                    onChange={(e) => updateAboutItem('values', idx, 'description', e.target.value)}
                                                    className="w-full bg-transparent border-none text-muted-foreground text-xs p-0 focus:ring-0 resize-none font-medium leading-relaxed"
                                                    placeholder="Value description..."
                                                    rows={3}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => addAboutItem('values', { title: 'New Value', description: '', iconName: 'Leaf' })}
                                        className="w-full border-2 border-dashed border-neutral-200 dark:border-white/5 rounded-3xl py-12 text-muted-foreground font-bold flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-white/5 hover:border-purple-500/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                                    >
                                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add Core Value
                                    </button>
                                </div>
                            )}

                            {/* About - Team */}
                            {activeAboutSection === 'team' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-neutral-100 dark:border-neutral-800">
                                        <Field label="Section Title" value={settings.aboutPage.team.title} onChange={(v) => updateAboutNested('team', 'title', v)} placeholder="Meet the Team" />
                                        <Field label="Section Subtitle" value={settings.aboutPage.team.subtitle} onChange={(v) => updateAboutNested('team', 'subtitle', v)} placeholder="The creative minds..." />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {settings.aboutPage.team.members.map((member: any, idx: number) => (
                                            <div key={idx} className="p-6 bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 rounded-3xl flex items-center gap-6 group relative shadow-sm">
                                                <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-inner">
                                                    {member.image ? (
                                                        <img src={member.image} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><ImageIcon className="w-6 h-6" /></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1.5">
                                                    <input
                                                        type="text"
                                                        value={member.name}
                                                        onChange={(e) => updateAboutItem('team', idx, 'name', e.target.value)}
                                                        className="w-full bg-transparent border-none text-foreground font-black p-0 focus:ring-0 text-sm"
                                                        placeholder="Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={member.role}
                                                        onChange={(e) => updateAboutItem('team', idx, 'role', e.target.value)}
                                                        className="w-full bg-transparent border-none text-purple-600 dark:text-purple-400 font-black p-0 focus:ring-0 text-[9px] uppercase tracking-widest"
                                                        placeholder="Role"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={member.image}
                                                        onChange={(e) => updateAboutItem('team', idx, 'image', e.target.value)}
                                                        className="w-full bg-transparent border-none text-neutral-400 font-mono p-0 focus:ring-0 text-[8px] truncate"
                                                        placeholder="Image URL..."
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removeAboutItem('team', idx)}
                                                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => addAboutItem('team', { name: '', role: '', image: '' })}
                                        className="w-full border-2 border-dashed border-neutral-200 dark:border-white/5 rounded-3xl py-12 text-muted-foreground font-bold flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-white/5 hover:border-purple-500/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                                    >
                                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add Team Member
                                    </button>
                                </div>
                            )}
                        </div>

                        <SaveButton onClick={() => handleSave('aboutPage')} saving={saving} label="Save About Page" />
                    </motion.div>
                )}

                {activeTab === 'collections' && (
                    <motion.div key="collections" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-black">Collections Management</h1>
                                <p className="text-gray-400 text-sm">Control which products appear in special collections.</p>
                            </div>

                            <div className="relative group max-w-xs w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={productSearchQuery}
                                    onChange={(e) => setProductSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {productLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products
                                    .filter(p => p.title.toLowerCase().includes(productSearchQuery.toLowerCase()) || p.category.toLowerCase().includes(productSearchQuery.toLowerCase()))
                                    .map((product) => (
                                        <div key={product._id} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden group shadow-sm">
                                            <div className="aspect-[16/10] relative overflow-hidden">
                                                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    {product.featured && <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Featured</span>}
                                                    {product.isBestSeller && <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Best Seller</span>}
                                                </div>
                                            </div>

                                            <div className="p-5 space-y-4">
                                                <div>
                                                    <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-1">{product.category}</p>
                                                    <h3 className="font-bold text-sm truncate">{product.title}</h3>
                                                </div>

                                                <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                                    <SectionToggle
                                                        productId={product._id}
                                                        field="featured"
                                                        value={product.featured}
                                                        icon={Star}
                                                        label="Featured"
                                                        updatingId={updatingProductId}
                                                        onToggle={toggleProductStatus}
                                                    />
                                                    <SectionToggle
                                                        productId={product._id}
                                                        field="isBestSeller"
                                                        value={product.isBestSeller}
                                                        icon={TrendingUp}
                                                        label="Best Seller"
                                                        updatingId={updatingProductId}
                                                        onToggle={toggleProductStatus}
                                                    />
                                                    <SectionToggle
                                                        productId={product._id}
                                                        field="isNewArrival"
                                                        value={product.isNewArrival}
                                                        icon={Zap}
                                                        label="New"
                                                        updatingId={updatingProductId}
                                                        onToggle={toggleProductStatus}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'general' && settings && (
                    <motion.div key="general" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                        <SectionCard title="Brand Identity" description="Core brand elements like site name and contact details.">
                            <div className="mb-6">
                                <Label>Store Logo</Label>
                                <div
                                    className="relative mt-2 h-24 w-48 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-pointer group hover:border-purple-500/50 transition-all flex items-center justify-center bg-neutral-50 dark:bg-white/5"
                                    onClick={() => { currentUploadField.current = 'mainSettings.logo'; fileInputRef.current?.click(); }}
                                >
                                    {settings.mainSettings.logo ? (
                                        <img src={settings.mainSettings.logo} alt="Logo" className="max-h-full max-w-full p-2 object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground text-xs text-center p-2">
                                            <ImageIcon className="w-6 h-6" />
                                            <p className="font-medium">Upload Logo</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {uploadingField === 'mainSettings.logo' ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Upload className="w-6 h-6 text-white" />}
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2">Recommended: Transparent PNG, approx 200x80px</p>
                            </div>

                            <Field label="Store Name" value={settings.mainSettings.siteName} onChange={(v) => updateGeneral('siteName', v)} placeholder="e.g. Said Store" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Contact Email" value={settings.mainSettings.contactEmail} onChange={(v) => updateGeneral('contactEmail', v)} placeholder="orders@yourstore.com" />
                                <Field label="Contact Phone" value={settings.mainSettings.contactPhone} onChange={(v) => updateGeneral('contactPhone', v)} placeholder="+212 600 000 000" />
                                <Field label="WhatsApp Number" value={settings.mainSettings.whatsappNumber} onChange={(v) => updateGeneral('whatsappNumber', v)} placeholder="+212 600 000 000" />
                            </div>
                            <Field label="Store Address" value={settings.mainSettings.address} onChange={(v) => updateGeneral('address', v)} placeholder="Physical store location" multiline />
                        </SectionCard>

                        <SectionCard title="Social Media" description="Links to your social media profiles.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Facebook URL" value={settings.mainSettings.socialLinks?.facebook} onChange={(v) => updateSocial('facebook', v)} placeholder="https://facebook.com/yourpage" />
                                <Field label="Instagram URL" value={settings.mainSettings.socialLinks?.instagram} onChange={(v) => updateSocial('instagram', v)} placeholder="https://instagram.com/yourpage" />
                                <Field label="Twitter URL" value={settings.mainSettings.socialLinks?.twitter} onChange={(v) => updateSocial('twitter', v)} placeholder="https://twitter.com/yourpage" />
                                <Field label="LinkedIn URL" value={settings.mainSettings.socialLinks?.linkedin} onChange={(v) => updateSocial('linkedin', v)} placeholder="https://linkedin.com/company/yourpage" />
                            </div>
                        </SectionCard>

                        <SaveButton onClick={() => handleSave('mainSettings')} saving={saving} label="Save General Settings" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Reusable Sub-components ---

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
            <div className="pb-6 border-b border-neutral-100 dark:border-neutral-800">
                <h2 className="text-2xl font-black">{title}</h2>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{description}</p>
            </div>
            {children}
        </div>
    );
}

function SaveButton({ onClick, saving, label }: { onClick: () => void; saving: boolean; label: string }) {
    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <button
                onClick={onClick}
                disabled={saving}
                className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-[0_20px_40px_rgba(147,51,234,0.3)] disabled:opacity-50 hover:scale-105 active:scale-95 group"
            >
                {saving ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                )}
                {saving ? 'Processing...' : label}
            </button>
        </div>
    );
}

function SectionToggle({ productId, field, value, icon: Icon, label, updatingId, onToggle }: any) {
    const isUpdating = updatingId === `${productId}-${field}`;
    return (
        <button
            onClick={() => onToggle(productId, field, value)}
            disabled={isUpdating}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border",
                value
                    ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/20"
                    : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            )}
        >
            {isUpdating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
                <Icon className={cn("w-3 h-3", value ? "text-white" : "text-gray-500")} />
            )}
            {label}
        </button>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">{children}</label>;
}

function Field({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {multiline ? (
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-medium text-sm leading-relaxed"
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-5 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-sm"
                />
            )}
        </div>
    );
}
