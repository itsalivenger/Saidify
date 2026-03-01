'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Save,
    Plus,
    Trash2,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
    History,
    Target,
    Heart,
    Users,
    ChevronDown,
    ChevronUp,
    Type,
    Globe
} from 'lucide-react';
import { cn } from "@/lib/utils";

const ICONS = ['Leaf', 'Award', 'Heart', 'ShieldCheck', 'Users', 'Target', 'Globe', 'Zap', 'Star', 'Smile'];

export default function AboutCMSPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeSection, setActiveSection] = useState<'mission' | 'story' | 'values' | 'team'>('mission');
    const [editingLang, setEditingLang] = useState<'en' | 'fr' | 'ar'>('en');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();

                // Initialize aboutPage if missing or incomplete for existing documents
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
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutPage: settings.aboutPage })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'About page updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update About page.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred during save.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const updateNested = (section: string, field: string, value: any) => {
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

    const addItem = (section: 'story' | 'values' | 'team', defaultValue: any) => {
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

    const removeItem = (section: 'story' | 'values' | 'team', index: number) => {
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

    const updateItem = (section: 'story' | 'values' | 'team', index: number, field: string, value: any) => {
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

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    const { aboutPage } = settings;

    return (
        <div className="space-y-8 max-w-4xl pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">About Page CMS</h1>
                    <p className="text-gray-400 font-medium">Manage your brand story, mission, and team members.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            {/* Notifications */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                            "p-4 rounded-2xl flex items-center gap-3 border shadow-lg font-bold",
                            message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tab Navigation */}
            <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 w-fit">
                {[
                    { id: 'mission', label: 'Mission', icon: Target },
                    { id: 'story', label: 'Our Story', icon: History },
                    { id: 'values', label: 'Values', icon: Heart },
                    { id: 'team', label: 'Team', icon: Users },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all",
                            activeSection === tab.id
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                                : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Editor Content */}
            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 min-h-[400px]">
                {/* Mission Section */}
                {activeSection === 'mission' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Badge Text</label>
                                    <input
                                        type="text"
                                        value={aboutPage.mission.badge}
                                        onChange={(e) => updateNested('mission', 'badge', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                                        placeholder="e.g. Our Mission"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Hero Title</label>
                                    <input
                                        type="text"
                                        value={aboutPage.mission.title}
                                        onChange={(e) => updateNested('mission', 'title', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                                        placeholder="Main headline..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Background Image URL</label>
                                    <input
                                        type="text"
                                        value={aboutPage.mission.bgImage}
                                        onChange={(e) => updateNested('mission', 'bgImage', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium font-mono"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Mission Description</label>
                                <textarea
                                    value={aboutPage.mission.description}
                                    onChange={(e) => updateNested('mission', 'description', e.target.value)}
                                    rows={8}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium resize-none"
                                    placeholder="Tell your mission..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Story Section */}
                {activeSection === 'story' && (
                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Section Title</label>
                            <input
                                type="text"
                                value={aboutPage.story.title}
                                onChange={(e) => updateNested('story', 'title', e.target.value)}
                                className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                                placeholder="Our Journey..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">Timeline Events</label>
                            {aboutPage.story.timeline.map((item: any, idx: number) => (
                                <motion.div key={idx} layout className="p-6 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col md:flex-row gap-4 items-start relative group">
                                    <div className="w-24 shrink-0">
                                        <input
                                            type="text"
                                            value={item.year}
                                            onChange={(e) => updateItem('story', idx, 'year', e.target.value)}
                                            className="w-full bg-white/10 border-none rounded-xl px-3 py-2 text-sm font-black text-center text-purple-400"
                                            placeholder="Year"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            value={item.title?.[editingLang] || ''}
                                            onChange={(e) => updateItem('story', idx, 'title', { ...(item.title || {}), [editingLang]: e.target.value })}
                                            className="w-full bg-transparent border-none text-white font-black text-lg p-0 focus:ring-0"
                                            placeholder="Event Title..."
                                        />
                                        <textarea
                                            value={item.description?.[editingLang] || ''}
                                            onChange={(e) => updateItem('story', idx, 'description', { ...(item.description || {}), [editingLang]: e.target.value })}
                                            className="w-full bg-transparent border-none text-gray-400 text-sm p-0 focus:ring-0 resize-none"
                                            placeholder="Description..."
                                            rows={2}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeItem('story', idx)}
                                        className="p-2 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                            <button
                                onClick={() => addItem('story', { year: '2025', title: 'New Event', description: '' })}
                                className="w-full border-2 border-dashed border-white/5 rounded-[2rem] py-8 text-gray-500 font-bold flex items-center justify-center gap-2 hover:bg-white/5 hover:border-purple-500/20 hover:text-purple-400 transition-all"
                            >
                                <Plus className="w-5 h-5" /> Add Timeline Milestone
                            </button>
                        </div>
                    </div>
                )}

                {/* Values Section */}
                {activeSection === 'values' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {aboutPage.values.map((value: any, idx: number) => (
                                <motion.div key={idx} layout className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-4 group relative">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:bg-white group-hover:text-black transition-all">
                                            <select
                                                value={value.iconName}
                                                onChange={(e) => updateItem('values', idx, 'iconName', e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            >
                                                {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                            </select>
                                            <span className="text-sm font-black">{value.iconName[0]}</span>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={value.title?.[editingLang] || ''}
                                                onChange={(e) => updateItem('values', idx, 'title', { ...(value.title || {}), [editingLang]: e.target.value })}
                                                className="w-full bg-transparent border-none text-white font-black p-0 focus:ring-0"
                                                placeholder="Value Title..."
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeItem('values', idx)}
                                            className="p-2 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <textarea
                                        value={value.description?.[editingLang] || ''}
                                        onChange={(e) => updateItem('values', idx, 'description', { ...(value.description || {}), [editingLang]: e.target.value })}
                                        className="w-full bg-transparent border-none text-gray-400 text-xs p-0 focus:ring-0 resize-none"
                                        placeholder="Value description..."
                                        rows={3}
                                    />
                                </motion.div>
                            ))}
                        </div>
                        <button
                            onClick={() => addItem('values', { title: 'New Value', description: '', iconName: 'Leaf' })}
                            className="w-full border-2 border-dashed border-white/5 rounded-[2rem] py-12 text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-purple-500/20 hover:text-purple-400 transition-all"
                        >
                            <Plus className="w-5 h-5" /> Add Core Value
                        </button>
                    </div>
                )}

                {/* Team Section */}
                {activeSection === 'team' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Section Title</label>
                                <input
                                    type="text"
                                    value={aboutPage.team.title}
                                    onChange={(e) => updateNested('team', 'title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Section Subtitle</label>
                                <input
                                    type="text"
                                    value={aboutPage.team.subtitle}
                                    onChange={(e) => updateNested('team', 'subtitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {aboutPage.team.members.map((member: any, idx: number) => (
                                <motion.div key={idx} layout className="p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-6 group relative">
                                    <div className="w-20 h-20 bg-white/5 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                                        <img src={member.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={member.name}
                                            onChange={(e) => updateItem('team', idx, 'name', e.target.value)}
                                            className="w-full bg-transparent border-none text-white font-black p-0 focus:ring-0 text-sm"
                                            placeholder="Name"
                                        />
                                        <input
                                            type="text"
                                            value={member.role?.[editingLang] || ''}
                                            onChange={(e) => updateItem('team', idx, 'role', { ...(member.role || {}), [editingLang]: e.target.value })}
                                            className="w-full bg-transparent border-none text-purple-400 font-bold p-0 focus:ring-0 text-[10px] uppercase tracking-widest"
                                            placeholder="Role"
                                        />
                                        <input
                                            type="text"
                                            value={member.image}
                                            onChange={(e) => updateItem('team', idx, 'image', e.target.value)}
                                            className="w-full bg-transparent border-none text-gray-600 font-mono p-0 focus:ring-0 text-[8px] truncate"
                                            placeholder="Image URL"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeItem('team', idx)}
                                        className="p-2 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                        <button
                            onClick={() => addItem('team', { name: '', role: '', image: '' })}
                            className="w-full border-2 border-dashed border-white/5 rounded-[2rem] py-12 text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-purple-500/20 hover:text-purple-400 transition-all"
                        >
                            <Plus className="w-5 h-5" /> Add Team Member
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


function Label({ children }: { children: React.ReactNode }) {
    return <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">{children}</label>;
}

function LocalizedField({ label, obj, lang, onChange, placeholder, multiline }: { label: string; obj: any; lang: string; onChange: (v: any) => void; placeholder?: string; multiline?: boolean }) {
    const value = obj?.[lang] || '';
    return (
        <div className="space-y-2">
            <Label>{label} ({lang.toUpperCase()})</Label>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange({ ...(obj || {}), [lang]: e.target.value })}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-medium text-sm leading-relaxed"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange({ ...(obj || {}), [lang]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-5 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-sm"
                />
            )}
        </div>
    );
}
