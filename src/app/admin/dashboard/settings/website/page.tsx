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
    Globe
} from 'lucide-react';

const TABS = [
    { id: 'home', label: 'Home Page', icon: Layout },
    { id: 'general', label: 'General Settings', icon: Settings },
];

export default function WebsiteControlPage() {
    const [activeTab, setActiveTab] = useState('home');
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedTab, setSavedTab] = useState<string | null>(null);
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUploadField = useRef<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error('Error fetching settings', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (section: string) => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const payload: any = {};
            if (section === 'hero') payload['homepage.hero'] = settings.homepage.hero;
            if (section === 'promo') payload['homepage.promoBanner'] = settings.homepage.promoBanner;
            if (section === 'newsletter') payload['homepage.newsletter'] = settings.homepage.newsletter;
            if (section === 'testimonials') payload['homepage.testimonials'] = settings.homepage.testimonials;

            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setSavedTab(section);
                setTimeout(() => setSavedTab(null), 2000);
            }
        } catch (err) {
            console.error('Save error', err);
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

    const removeTestimonial = (index: number) => {
        setSettings((prev: any) => {
            const updated = prev.homepage.testimonials.filter((_: any, i: number) => i !== index);
            return { ...prev, homepage: { ...prev.homepage, testimonials: updated } };
        });
    };

    const handleSaveGeneral = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');

            console.log("Saving mainSettings:", settings.mainSettings);

            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mainSettings: settings.mainSettings }),
            });

            if (res.ok) {
                setSavedTab('general');
                setTimeout(() => setSavedTab(null), 2000);
            } else {
                const data = await res.json();
                alert(`Error saving general settings: ${data.message || res.statusText}`);
            }
        } catch (err) {
            console.error('Save error', err);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveHome = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ homepage: settings.homepage }),
            });

            if (res.ok) {
                setSavedTab('home');
                setTimeout(() => setSavedTab(null), 2000);
            } else {
                const data = await res.json();
                alert(`Error saving home page changes: ${data.message || res.statusText}`);
            }
        } catch (err) {
            console.error('Save error', err);
        } finally {
            setSaving(false);
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
        <div className="p-8 max-w-5xl mx-auto">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => currentUploadField.current && handleImageUpload(e, currentUploadField.current)}
            />

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-black mb-2">Website Control</h1>
                <p className="text-muted-foreground">Manage the content displayed on your storefront pages.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                            : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Panels */}
            <AnimatePresence mode="wait">
                {activeTab === 'home' && settings && (
                    <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12 pb-20">
                        {/* Hero Section */}
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

                        {/* Promo Banner */}
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

                        {/* Newsletter */}
                        <SectionCard title="Newsletter Section" description="The email subscription section at the bottom of the homepage.">
                            <Field label="Headline" value={settings.homepage.newsletter.title} onChange={(v) => updateNewsletter('title', v)} placeholder="e.g. Join the Club" />
                            <Field label="Subtitle" value={settings.homepage.newsletter.subtitle} onChange={(v) => updateNewsletter('subtitle', v)} placeholder="Enter the newsletter subtext" multiline />
                        </SectionCard>

                        {/* Testimonials */}
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
                                <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} onClick={() => updateTestimonial(i, 'rating', star)}>
                                                    <Star className={`w-5 h-5 ${star <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => removeTestimonial(i)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors">
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

                        {/* Sticky Save Bar */}
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                            <button
                                onClick={handleSaveHome}
                                disabled={saving}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl ${savedTab === 'home'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 active:scale-95'
                                    } disabled:opacity-50`}
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : savedTab === 'home' ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                {savedTab === 'home' ? 'Home Page Saved!' : 'Save Home Page Changes'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'general' && settings && (
                    <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 pb-20">
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

                        <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                            <h3 className="text-lg font-black text-amber-500 mb-2">Advanced Settings</h3>
                            <p className="text-sm text-amber-500/80">More configuration options (currencies, taxes, logic) are coming soon to this section.</p>
                        </div>

                        {/* Sticky Save Bar */}
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                            <button
                                onClick={handleSaveGeneral}
                                disabled={saving}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl ${savedTab === 'general'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 active:scale-95'
                                    } disabled:opacity-50`}
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : savedTab === 'general' ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                {savedTab === 'general' ? 'General Settings Saved!' : 'Save General Changes'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Reusable Sub-components ---

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 space-y-6">
            <div className="pb-6 border-b border-neutral-100 dark:border-neutral-800">
                <h2 className="text-2xl font-black">{title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            {children}
        </div>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-1.5">{children}</label>;
}

function Field({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
    return (
        <div>
            <Label>{label}</Label>
            {multiline ? (
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none font-medium text-sm"
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-medium text-sm"
                />
            )}
        </div>
    );
}


