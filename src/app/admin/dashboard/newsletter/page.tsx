'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Users,
    Send,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Search,
    RefreshCw,
    CheckSquare,
    Square,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
} from 'lucide-react';

interface Subscriber {
    _id: string;
    email: string;
    name?: string;
    active: boolean;
    subscribedAt: string;
}

export default function AdminNewsletterPage() {
    const [activeTab, setActiveTab] = useState<'subscribers' | 'campaign'>('subscribers');
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Campaign form state
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [recipientType, setRecipientType] = useState<'all' | 'selected'>('all');
    const [sendLoading, setSendLoading] = useState(false);
    const [sendResult, setSendResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const getToken = () => localStorage.getItem('adminToken') || '';

    const fetchSubscribers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter', {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSubscribers(data);
            }
        } catch (err) {
            console.error('Failed to fetch subscribers:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    const filteredSubscribers = subscribers.filter(
        (s) =>
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredSubscribers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSubscribers.map((s) => s._id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleActive = async (sub: Subscriber) => {
        setActionLoading(sub._id);
        try {
            const res = await fetch('/api/newsletter', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ id: sub._id, active: !sub.active }),
            });
            if (res.ok) {
                setSubscribers((prev) =>
                    prev.map((s) => (s._id === sub._id ? { ...s, active: !s.active } : s))
                );
            }
        } finally {
            setActionLoading(null);
        }
    };

    const deleteSubscriber = async (id: string) => {
        if (!confirm('Remove this subscriber permanently?')) return;
        setActionLoading(id);
        try {
            const res = await fetch('/api/newsletter', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setSubscribers((prev) => prev.filter((s) => s._id !== id));
                setSelectedIds((prev) => prev.filter((x) => x !== id));
            }
        } finally {
            setActionLoading(null);
        }
    };

    const deleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} subscribers?`)) return;
        for (const id of selectedIds) {
            await deleteSubscriber(id);
        }
    };

    const sendCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendLoading(true);
        setSendResult(null);

        const selectedEmails =
            recipientType === 'selected'
                ? subscribers.filter((s) => selectedIds.includes(s._id)).map((s) => s.email)
                : [];

        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ subject, body, recipientType, selectedEmails }),
            });
            const data = await res.json();
            setSendResult({ type: res.ok ? 'success' : 'error', message: data.message });
            if (res.ok) {
                setSubject('');
                setBody('');
            }
        } catch {
            setSendResult({ type: 'error', message: 'Failed to send campaign. Please try again.' });
        } finally {
            setSendLoading(false);
        }
    };

    const activeCount = subscribers.filter((s) => s.active).length;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-purple-600/20 rounded-xl border border-purple-500/20">
                            <Mail className="w-5 h-5 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Newsletter</h1>
                    </div>
                    <p className="text-neutral-400 font-medium">
                        {subscribers.length} subscribers · {activeCount} active
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1">
                    {(['subscribers', 'campaign'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            {tab === 'subscribers' ? <Users className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                            {tab === 'subscribers' ? 'Subscribers' : 'Send Campaign'}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* ───────── SUBSCRIBERS TAB ───────── */}
                {activeTab === 'subscribers' && (
                    <motion.div
                        key="subscribers"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                    >
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search subscribers..."
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                {selectedIds.length > 0 && (
                                    <button
                                        onClick={deleteSelected}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-bold hover:bg-rose-500/20 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete ({selectedIds.length})
                                    </button>
                                )}
                                <button
                                    onClick={fetchSubscribers}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                            {loading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                </div>
                            ) : filteredSubscribers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Mail className="w-16 h-16 text-neutral-700 mb-4" />
                                    <p className="text-neutral-400 font-bold">No subscribers yet</p>
                                    <p className="text-neutral-600 text-sm mt-1">
                                        When someone subscribes from the site, they'll appear here.
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="py-4 px-4 text-left">
                                                <button onClick={toggleSelectAll} className="text-neutral-400 hover:text-white transition-colors">
                                                    {selectedIds.length === filteredSubscribers.length && filteredSubscribers.length > 0
                                                        ? <CheckSquare className="w-4 h-4" />
                                                        : <Square className="w-4 h-4" />}
                                                </button>
                                            </th>
                                            <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-neutral-500">Email</th>
                                            <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-neutral-500 hidden md:table-cell">Name</th>
                                            <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-neutral-500 hidden lg:table-cell">Subscribed</th>
                                            <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-neutral-500">Status</th>
                                            <th className="py-4 px-4 text-right text-xs font-black uppercase tracking-widest text-neutral-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/3">
                                        {filteredSubscribers.map((sub) => (
                                            <tr
                                                key={sub._id}
                                                className={`group transition-colors ${selectedIds.includes(sub._id) ? 'bg-purple-600/5' : 'hover:bg-white/2'}`}
                                            >
                                                <td className="py-4 px-4">
                                                    <button onClick={() => toggleSelect(sub._id)} className="text-neutral-400 hover:text-white transition-colors">
                                                        {selectedIds.includes(sub._id)
                                                            ? <CheckSquare className="w-4 h-4 text-purple-500" />
                                                            : <Square className="w-4 h-4" />}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-4 font-medium">{sub.email}</td>
                                                <td className="py-4 px-4 text-neutral-400 hidden md:table-cell">{sub.name || '—'}</td>
                                                <td className="py-4 px-4 text-neutral-500 hidden lg:table-cell">
                                                    {new Date(sub.subscribedAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${sub.active
                                                        ? 'bg-emerald-500/10 text-emerald-400'
                                                        : 'bg-neutral-500/10 text-neutral-500'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sub.active ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
                                                        {sub.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {actionLoading === sub._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => toggleActive(sub)}
                                                                    title={sub.active ? 'Deactivate' : 'Activate'}
                                                                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                                                                >
                                                                    {sub.active
                                                                        ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                                                                        : <ToggleLeft className="w-5 h-5" />}
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteSubscriber(sub._id)}
                                                                    title="Delete"
                                                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors text-neutral-400 hover:text-rose-400"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <p className="text-xs text-neutral-600 mt-3 px-1">
                            {filteredSubscribers.length} result{filteredSubscribers.length !== 1 ? 's' : ''} · {activeCount} active subscribers
                        </p>
                    </motion.div>
                )}

                {/* ───────── CAMPAIGN TAB ───────── */}
                {activeTab === 'campaign' && (
                    <motion.div
                        key="campaign"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="max-w-3xl"
                    >
                        <form onSubmit={sendCampaign} className="space-y-6">
                            {/* Recipient selector */}
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                                <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-4">Recipients</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {([
                                        { value: 'all', label: `All Active Subscribers`, count: activeCount },
                                        { value: 'selected', label: 'Selected from List', count: selectedIds.length },
                                    ] as const).map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setRecipientType(opt.value)}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${recipientType === opt.value
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <span className="font-bold text-sm">{opt.label}</span>
                                            <span className={`text-xs font-black px-2.5 py-1 rounded-full ${recipientType === opt.value ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-neutral-400'}`}>
                                                {opt.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {recipientType === 'selected' && selectedIds.length === 0 && (
                                    <p className="mt-3 text-sm text-amber-500/80 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Go to the Subscribers tab and select recipients first.
                                    </p>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                                <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-3">
                                    Subject Line
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. New Arrivals — Summer Collection 🌿"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 transition-colors font-medium"
                                />
                            </div>

                            {/* Body */}
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                                <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-3">
                                    Email Body
                                </label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder={`Write your email content here...\n\nUse newlines for paragraphs. The email will be wrapped in a branded template automatically.`}
                                    required
                                    rows={12}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 transition-colors font-medium resize-y leading-relaxed"
                                />
                                <p className="mt-2 text-xs text-neutral-600">
                                    Plain text — newlines become line breaks. Email will be wrapped in a branded template.
                                </p>
                            </div>

                            {/* Result banner */}
                            {sendResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-3 p-4 rounded-xl border ${sendResult.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                        }`}
                                >
                                    {sendResult.type === 'success'
                                        ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                        : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                                    <p className="font-bold text-sm">{sendResult.message}</p>
                                </motion.div>
                            )}

                            {/* Send button */}
                            <button
                                type="submit"
                                disabled={sendLoading || (recipientType === 'selected' && selectedIds.length === 0)}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-purple-600/20 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sendLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending Campaign...</>
                                ) : (
                                    <><Send className="w-5 h-5" /> Send Campaign</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
