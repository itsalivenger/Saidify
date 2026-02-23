'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Save, Plus, Trash2, Upload, Loader2,
    X, Check, Pencil, Move, Target, Maximize2,
    Info, Layers, Palette, Image as ImageIcon, Type
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface PrintZone {
    id: string;
    label: string;
    x: number;      // % from left
    y: number;      // % from top
    width: number;  // % of image width
    height: number; // % of image height
    maxLayers: number;
    locked: boolean;
}

interface ProductView {
    name: string;
    mockupImage: string;
    printZones: PrintZone[];
}

interface Variant {
    color: string;
    colorHex: string;
    sizes: string[];
    available: boolean;
}

interface BlankProductForm {
    name: string;
    description: string;
    basePrice: number;
    tags: string[];
    variants: Variant[];
    views: ProductView[];
    allowText: boolean;
    allowMultipleZones: boolean;
    active: boolean;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const TABS = ['1. Product Basics', '2. Studio Design', 'Guide & Help'];

const DEFAULT_FORM: BlankProductForm = {
    name: '',
    description: '',
    basePrice: 0,
    tags: [],
    variants: [],
    views: [],
    allowText: true,
    allowMultipleZones: false,
    active: true,
};

// ─── Zone Editor Component ────────────────────────────────────────────────────
function ZoneEditor({
    view,
    onZoneChange,
}: {
    view: ProductView;
    onZoneChange: (zones: PrintZone[]) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [zones, setZones] = useState<PrintZone[]>(view.printZones || []);
    const [drawing, setDrawing] = useState(false);
    const [startPt, setStartPt] = useState({ x: 0, y: 0 });
    const [activeDraw, setActiveDraw] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [editingLabel, setEditingLabel] = useState<string | null>(null);
    const [newLabel, setNewLabel] = useState('');

    // We don't need the useEffect to sync up anymore, we'll call onZoneChange directly
    // in the update functions below to avoid cascading renders.

    const getRelativeCoords = (e: React.MouseEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        return {
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!view.mockupImage) return;
        e.preventDefault();
        const pt = getRelativeCoords(e);
        setStartPt(pt);
        setDrawing(true);
        setActiveDraw({ x: pt.x, y: pt.y, w: 0, h: 0 });
        setSelectedZoneId(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!drawing) return;
        const pt = getRelativeCoords(e);
        setActiveDraw({
            x: Math.min(startPt.x, pt.x),
            y: Math.min(startPt.y, pt.y),
            w: Math.abs(pt.x - startPt.x),
            h: Math.abs(pt.y - startPt.y),
        });
    };

    const handleMouseUp = () => {
        if (!drawing || !activeDraw) return;
        setDrawing(false);
        if (activeDraw.w < 2 || activeDraw.h < 2) {
            setActiveDraw(null);
            return;
        }
        const id = `zone-${Date.now()}`;
        const zone: PrintZone = {
            id,
            label: `Zone ${zones.length + 1}`,
            x: +activeDraw.x.toFixed(2),
            y: +activeDraw.y.toFixed(2),
            width: +activeDraw.w.toFixed(2),
            height: +activeDraw.h.toFixed(2),
            maxLayers: 5,
            locked: false,
        };
        const updated = [...zones, zone];
        setZones(updated);
        onZoneChange(updated);
        setSelectedZoneId(id);
        setActiveDraw(null);
    };

    const deleteZone = (id: string) => {
        const updated = zones.filter(z => z.id !== id);
        setZones(updated);
        onZoneChange(updated);
        if (selectedZoneId === id) setSelectedZoneId(null);
    };

    const startEditLabel = (zone: PrintZone) => {
        setEditingLabel(zone.id);
        setNewLabel(zone.label);
    };

    const saveLabel = () => {
        if (!editingLabel) return;
        const updated = zones.map(z => z.id === editingLabel ? { ...z, label: newLabel } : z);
        setZones(updated);
        onZoneChange(updated);
        setEditingLabel(null);
    };

    const updateZoneField = (id: string, key: keyof PrintZone, value: any) => {
        const updated = zones.map(z => z.id === id ? { ...z, [key]: value } : z);
        setZones(updated);
        onZoneChange(updated);
    };

    const selectedZone = zones.find(z => z.id === selectedZoneId);

    return (
        <div className="space-y-4">
            {!view.mockupImage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    Upload a mockup image first, then draw print zones by clicking and dragging on it.
                </div>
            )}

            {view.mockupImage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 text-sm">
                    <Target className="w-4 h-4" />
                    <strong>Click and drag</strong> on the mockup to draw a print zone. Click a zone to select and configure it.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
                {/* Canvas Area */}
                <div
                    ref={containerRef}
                    className={`relative w-full select-none overflow-hidden rounded-2xl border-2 ${view.mockupImage
                        ? 'border-neutral-200 dark:border-neutral-700 cursor-crosshair'
                        : 'border-dashed border-neutral-200 dark:border-neutral-800'
                        } bg-neutral-50 dark:bg-neutral-900`}
                    style={{ aspectRatio: '3/4' }}
                    onMouseDown={view.mockupImage ? handleMouseDown : undefined}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => { if (drawing) handleMouseUp(); }}
                >
                    {view.mockupImage ? (
                        <img
                            src={view.mockupImage}
                            alt="Mockup"
                            className="w-full h-full object-contain pointer-events-none"
                            draggable={false}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                            <ImageIcon className="w-10 h-10" />
                            <p className="text-sm">Upload a mockup image above</p>
                        </div>
                    )}

                    {/* Existing Zones */}
                    {zones.map(zone => (
                        <div
                            key={zone.id}
                            className={`absolute border-2 cursor-pointer transition-all ${selectedZoneId === zone.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-blue-400 bg-blue-400/10 hover:bg-blue-400/20'
                                }`}
                            style={{
                                left: `${zone.x}%`,
                                top: `${zone.y}%`,
                                width: `${zone.width}%`,
                                height: `${zone.height}%`,
                            }}
                            onClick={(e) => { e.stopPropagation(); setSelectedZoneId(zone.id); }}
                        >
                            {/* Zone Label */}
                            <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded-t text-xs font-bold whitespace-nowrap ${selectedZoneId === zone.id ? 'bg-purple-500 text-white' : 'bg-blue-400 text-white'
                                }`}>
                                {zone.label}
                            </div>
                            {/* Resize handle indicator */}
                            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-current opacity-60" />
                        </div>
                    ))}

                    {/* Active draw preview */}
                    {activeDraw && (
                        <div
                            className="absolute border-2 border-dashed border-purple-500 bg-purple-500/15 pointer-events-none"
                            style={{
                                left: `${activeDraw.x}%`,
                                top: `${activeDraw.y}%`,
                                width: `${activeDraw.w}%`,
                                height: `${activeDraw.h}%`,
                            }}
                        />
                    )}
                </div>

                {/* Zone Properties Panel */}
                <div className="space-y-3">
                    <h4 className="font-black text-sm uppercase tracking-widest text-muted-foreground">
                        {selectedZone ? 'Zone Properties' : 'Draw a Zone'}
                    </h4>

                    {!selectedZone && (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                            <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            No zone selected.<br />Draw or click a zone to configure it.
                        </div>
                    )}

                    {selectedZone && (
                        <div className="space-y-3">
                            {/* Label */}
                            <div className="p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Zone Label</label>
                                {editingLabel === selectedZone.id ? (
                                    <div className="flex gap-2">
                                        <input
                                            value={newLabel}
                                            onChange={e => setNewLabel(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') saveLabel(); }}
                                            className="flex-1 px-2 py-1 rounded-lg border text-sm"
                                            autoFocus
                                        />
                                        <button onClick={saveLabel} className="p-1 bg-purple-600 text-white rounded-lg">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold">{selectedZone.label}</span>
                                        <button onClick={() => startEditLabel(selectedZone)} className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg">
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Coordinates (read-only display) */}
                            <div className="p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                                <label className="text-xs font-bold text-muted-foreground mb-2 block">Position & Size</label>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {[
                                        { label: 'X', value: selectedZone.x.toFixed(1) + '%' },
                                        { label: 'Y', value: selectedZone.y.toFixed(1) + '%' },
                                        { label: 'W', value: selectedZone.width.toFixed(1) + '%' },
                                        { label: 'H', value: selectedZone.height.toFixed(1) + '%' },
                                    ].map(f => (
                                        <div key={f.label} className="flex justify-between items-center bg-neutral-50 dark:bg-white/5 px-2 py-1.5 rounded-lg">
                                            <span className="text-muted-foreground font-medium">{f.label}</span>
                                            <span className="font-black font-mono">{f.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Max Layers */}
                            <div className="p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Max Design Layers</label>
                                <input
                                    type="number"
                                    min={1} max={10}
                                    value={selectedZone.maxLayers}
                                    onChange={e => updateZoneField(selectedZone.id, 'maxLayers', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 rounded-xl border text-sm font-bold"
                                />
                            </div>

                            {/* Locked */}
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                                <div>
                                    <p className="text-sm font-bold">Lock Zone Position</p>
                                    <p className="text-xs text-muted-foreground">Client cannot move design outside this zone</p>
                                </div>
                                <button
                                    onClick={() => updateZoneField(selectedZone.id, 'locked', !selectedZone.locked)}
                                    className={`relative w-10 h-5 rounded-full transition-colors ${selectedZone.locked ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                                >
                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${selectedZone.locked ? 'left-5' : 'left-0.5'}`} />
                                </button>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={() => deleteZone(selectedZone.id)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors font-bold text-sm"
                            >
                                <Trash2 className="w-4 h-4" /> Delete Zone
                            </button>
                        </div>
                    )}

                    {/* Zone List */}
                    {zones.length > 0 && (
                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                            <p className="text-xs font-bold text-muted-foreground mb-2">ALL ZONES ({zones.length})</p>
                            <div className="space-y-1">
                                {zones.map(z => (
                                    <button
                                        key={z.id}
                                        onClick={() => setSelectedZoneId(z.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${selectedZoneId === z.id ? 'bg-purple-600 text-white' : 'bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                            {z.label}
                                        </span>
                                        <span className="text-xs opacity-60">{z.width.toFixed(0)}×{z.height.toFixed(0)}%</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BlankProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const productId = isNew ? null : params.id as string;

    const [form, setForm] = useState<BlankProductForm>(DEFAULT_FORM);
    const [activeTab, setActiveTab] = useState(0);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [saved, setSaved] = useState(false);

    // Variant dialog state
    const [showVariantDialog, setShowVariantDialog] = useState(false);
    const [variantDraft, setVariantDraft] = useState<Variant>({ color: '', colorHex: '#ffffff', sizes: ['M'], available: true });

    // View dialog state
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [viewDraft, setViewDraft] = useState('');
    const [activeViewIdx, setActiveViewIdx] = useState(0);
    const [uploadingMockup, setUploadingMockup] = useState<number | null>(null);
    const mockupInputRef = useRef<HTMLInputElement>(null);
    const pendingMockupViewIdx = useRef<number | null>(null);

    // Load existing product for edit
    useEffect(() => {
        if (!productId) return;
        const load = async () => {
            try {
                const res = await fetch(`/api/blanks/${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setForm({
                        name: data.name || '',
                        description: data.description || '',
                        basePrice: data.basePrice || 0,
                        tags: data.tags || [],
                        variants: data.variants || [],
                        views: data.views || [],
                        allowText: data.allowText ?? true,
                        allowMultipleZones: data.allowMultipleZones ?? false,
                        active: data.active ?? true,
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [productId]);

    const handleSave = async (shouldReset = false) => {
        if (!form.name || !form.basePrice) {
            alert('Please fill in required fields (Name and Price)');
            return;
        }
        setSaving(true);
        try {
            const url = isNew ? '/api/blanks' : `/api/blanks/${productId}`;
            const method = isNew ? 'POST' : 'PUT';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
                if (isNew && !shouldReset) {
                    const data = await res.json();
                    router.replace(`/admin/dashboard/blanks/${data._id}`);
                } else if (shouldReset) {
                    setForm(DEFAULT_FORM);
                    setActiveTab(0);
                    router.push('/admin/dashboard/blanks/new');
                }
            }
        } catch (e) {
            console.error('Save error', e);
        } finally {
            setSaving(false);
        }
    };

    const handleMockupUpload = async (e: React.ChangeEvent<HTMLInputElement>, viewIdx: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingMockup(viewIdx);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            if (res.ok) {
                const { url } = await res.json();
                setForm(prev => {
                    const views = [...prev.views];
                    if (!views[viewIdx]) {
                        views[viewIdx] = {
                            name: viewIdx === 0 ? 'Front' : `View ${viewIdx + 1}`,
                            mockupImage: url,
                            printZones: []
                        };
                    } else {
                        views[viewIdx] = { ...views[viewIdx], mockupImage: url };
                    }
                    return { ...prev, views };
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploadingMockup(null);
            if (mockupInputRef.current) mockupInputRef.current.value = '';
        }
    };

    const addVariant = () => {
        if (!variantDraft.color) return;
        setForm(prev => ({ ...prev, variants: [...prev.variants, { ...variantDraft }] }));
        setVariantDraft({ color: '', colorHex: '#ffffff', sizes: ['M'], available: true });
        setShowVariantDialog(false);
    };

    const removeVariant = (i: number) => {
        setForm(prev => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }));
    };

    const addView = () => {
        if (!viewDraft.trim()) return;
        setForm(prev => ({ ...prev, views: [...prev.views, { name: viewDraft.trim(), mockupImage: '', printZones: [] }] }));
        setActiveViewIdx(form.views.length);
        setViewDraft('');
        setShowViewDialog(false);
    };

    const removeView = (i: number) => {
        setForm(prev => ({ ...prev, views: prev.views.filter((_, idx) => idx !== i) }));
        setActiveViewIdx(Math.max(0, activeViewIdx - 1));
    };

    const updateViewZones = (viewIdx: number, zones: PrintZone[]) => {
        setForm(prev => {
            const views = [...prev.views];
            views[viewIdx] = { ...views[viewIdx], printZones: zones };
            return { ...prev, views };
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <input
                ref={mockupInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => pendingMockupViewIdx.current !== null && handleMockupUpload(e, pendingMockupViewIdx.current)}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/admin/dashboard/blanks')} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black">{isNew ? 'New Blank Product' : `Edit: ${form.name}`}</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Configure a customizable product for the Design Studio</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {isNew && (
                        <button
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Save & Add Another
                        </button>
                    )}
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20'
                            } disabled:opacity-50`}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? 'Saved!' : saving ? 'Saving...' : isNew ? 'Add Product' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === i
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                            : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Step-by-Step Info Banner */}
            {activeTab < 2 && (
                <div className="mb-6 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white font-black shrink-0">
                        {activeTab + 1}
                    </div>
                    <div>
                        <p className="font-bold text-purple-900 dark:text-purple-100">
                            {activeTab === 0 ? "First, define the product details." : "Now, configure the design areas."}
                        </p>
                        <p className="text-sm text-purple-600/80 dark:text-purple-400/80">
                            {activeTab === 0
                                ? "Give your product a name, price, and color variants. These appear in the shop catalog."
                                : "Upload mockups and draw 'Print Zones' where customers can place their designs."
                            }
                        </p>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* ── STEP 1: Product Basics (Consolidated) ── */}
                {activeTab === 0 && (
                    <motion.div key="basics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Side: General Info */}
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 space-y-6">
                                <SectionHeader title="General Information" />

                                <FormField label="Product Name *">
                                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                        placeholder="e.g. Classic Cotton T-Shirt"
                                        className="w-full input-style" />
                                </FormField>

                                <FormField label="Description">
                                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                        placeholder="Briefly describe this product..." rows={3}
                                        className="w-full input-style resize-none" />
                                </FormField>

                                <FormField label="Base Price (MAD) *">
                                    <input type="number" min={0} value={form.basePrice}
                                        onChange={e => setForm(p => ({ ...p, basePrice: parseFloat(e.target.value) || 0 }))}
                                        className="w-full input-style" />
                                </FormField>

                                <FormField label="Main Catalog Mockup">
                                    <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-bold">This image shows up in the shop listings.</p>
                                    <div
                                        className="relative h-48 w-40 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 overflow-hidden group cursor-pointer hover:border-purple-500/50 transition-all flex items-center justify-center bg-neutral-50 dark:bg-white/5"
                                        onClick={() => { pendingMockupViewIdx.current = 0; mockupInputRef.current?.click(); }}
                                    >
                                        {form.views[0]?.mockupImage ? (
                                            <img src={form.views[0].mockupImage} alt="Main mockup" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground text-center p-4">
                                                <ImageIcon className="w-6 h-6" />
                                                <p className="text-[8px] font-bold uppercase tracking-wider">Click to Upload</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {uploadingMockup === 0 ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Upload className="w-6 h-6 text-white" />}
                                        </div>
                                    </div>
                                </FormField>
                            </div>

                            {/* Right Side: Variants & Options */}
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <SectionHeader title="Color Variants" />
                                        <button onClick={() => setShowVariantDialog(true)}
                                            className="p-2 bg-purple-600 text-white rounded-xl">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {form.variants.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No colors added yet.</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            {form.variants.map((v, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-neutral-800">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: v.colorHex }} />
                                                        <span className="text-xs font-bold">{v.color}</span>
                                                    </div>
                                                    <button onClick={() => removeVariant(i)} className="text-rose-500">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 space-y-4">
                                    <SectionHeader title="Studio Features" />
                                    {[
                                        { key: 'allowText', label: 'Allow Text Layers', desc: 'Can add custom text', icon: Type },
                                        { key: 'allowMultipleZones', label: 'Multi-Zone Design', desc: 'Can design Front + Back etc.', icon: Layers },
                                        { key: 'active', label: 'Published', desc: 'Active in Design Studio', icon: Palette },
                                    ].map(opt => (
                                        <div key={opt.key} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-xs">{opt.label}</p>
                                                <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setForm(p => ({ ...p, [opt.key]: !(p as any)[opt.key] }))}
                                                className={`relative w-8 h-4 rounded-full transition-colors ${(form as any)[opt.key] ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                                            >
                                                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${(form as any)[opt.key] ? 'left-4.5' : 'left-0.5'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setActiveTab(1)}
                                className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-transform"
                            >
                                Next Step: Configure Design areas
                            </button>
                        </div>

                        {/* Variant Dialog */}
                        <AnimatePresence>
                            {showVariantDialog && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                        className="bg-white dark:bg-neutral-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
                                        <h3 className="text-xl font-black mb-6">Add Color Variant</h3>
                                        <div className="space-y-4">
                                            <FormField label="Color Name">
                                                <input value={variantDraft.color} onChange={e => setVariantDraft(v => ({ ...v, color: e.target.value }))}
                                                    placeholder="e.g. Royal Blue"
                                                    className="w-full input-style" autoFocus />
                                            </FormField>
                                            <FormField label="Hex Code">
                                                <div className="flex gap-2">
                                                    <input type="color" value={variantDraft.colorHex} onChange={e => setVariantDraft(v => ({ ...v, colorHex: e.target.value }))}
                                                        className="h-10 w-12 rounded-lg cursor-pointer" />
                                                    <input value={variantDraft.colorHex} onChange={e => setVariantDraft(v => ({ ...v, colorHex: e.target.value }))}
                                                        className="flex-1 input-style font-mono" />
                                                </div>
                                            </FormField>
                                            <FormField label="Available Sizes">
                                                <div className="flex flex-wrap gap-2">
                                                    {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => (
                                                        <button key={s}
                                                            onClick={() => {
                                                                const sizes = variantDraft.sizes.includes(s)
                                                                    ? variantDraft.sizes.filter(sz => sz !== s)
                                                                    : [...variantDraft.sizes, s];
                                                                setVariantDraft(v => ({ ...v, sizes }));
                                                            }}
                                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${variantDraft.sizes.includes(s) ? 'bg-purple-600 text-white' : 'bg-neutral-100 dark:bg-white/5 text-muted-foreground'}`}>
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </FormField>
                                            <div className="flex gap-3 pt-4">
                                                <button onClick={() => setShowVariantDialog(false)} className="flex-1 py-3 rounded-2xl border font-bold">Cancel</button>
                                                <button onClick={addVariant} className="flex-1 py-3 rounded-2xl bg-purple-600 text-white font-bold">Add Color</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ── STEP 2: Studio Design ── */}
                {activeTab === 1 && (
                    <motion.div key="views" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Information Overlay */}
                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3 shadow-sm">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                                <strong>How to add a print area:</strong> Select a view (e.g. Front), then upload/replace the mockup image. Once uploaded, click and drag directly on the image to draw a blue rectangle. This rectangle represents where customers can place their logos or text.
                            </p>
                        </div>

                        {/* View Tabs */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {form.views.map((v, i) => (
                                <button key={i}
                                    onClick={() => setActiveViewIdx(i)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${activeViewIdx === i
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:bg-neutral-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {v.name}
                                    <span className="text-xs opacity-70 ml-1">({v.printZones?.length || 0})</span>
                                    {form.views.length > 1 && (
                                        <span onClick={(e) => { e.stopPropagation(); removeView(i); }}
                                            className="ml-1 p-0.5 hover:bg-white/20 rounded-full"
                                        ><X className="w-3 h-3" /></span>
                                    )}
                                </button>
                            ))}
                            <button onClick={() => setShowViewDialog(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm bg-purple-500/5 border border-dashed border-purple-500/30 text-purple-600 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all">
                                <Plus className="w-4 h-4" /> Add View
                            </button>
                        </div>

                        {form.views.length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
                                <Layers className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                                <h3 className="font-bold text-neutral-500 mb-1">No views configured</h3>
                                <p className="text-sm text-muted-foreground mb-4">Add a view (e.g. Front, Back) to start adding print zones.</p>
                                <button onClick={() => setShowViewDialog(true)} className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm">
                                    Add First View
                                </button>
                            </div>
                        ) : (
                            form.views[activeViewIdx] && (
                                <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 space-y-6 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <SectionHeader title={`View: ${form.views[activeViewIdx].name}`} />
                                        <button
                                            onClick={() => { pendingMockupViewIdx.current = activeViewIdx; mockupInputRef.current?.click(); }}
                                            disabled={uploadingMockup === activeViewIdx}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                                        >
                                            {uploadingMockup === activeViewIdx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            {form.views[activeViewIdx].mockupImage ? 'Change Mockup' : 'Upload Mockup'}
                                        </button>
                                    </div>

                                    <ZoneEditor
                                        key={`${activeViewIdx}-${form.views[activeViewIdx].name}`}
                                        view={form.views[activeViewIdx]}
                                        onZoneChange={(zones) => updateViewZones(activeViewIdx, zones)}
                                    />
                                </div>
                            )
                        )}

                        {/* Add View Dialog */}
                        <AnimatePresence>
                            {showViewDialog && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                        className="bg-white dark:bg-neutral-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
                                        <h3 className="text-xl font-black mb-4">Add Product View</h3>
                                        <div className="space-y-4">
                                            <FormField label="View Name">
                                                <input value={viewDraft} onChange={e => setViewDraft(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && addView()}
                                                    placeholder="e.g. Front, Back, Left Sleeve..."
                                                    className="w-full input-style" autoFocus />
                                            </FormField>
                                            {/* Quick-pick buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                {['Front', 'Back', 'Left Sleeve', 'Right Sleeve', 'Hood'].map(name => (
                                                    <button key={name} onClick={() => setViewDraft(name)}
                                                        className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${viewDraft === name ? 'bg-purple-600 text-white' : 'bg-neutral-100 dark:bg-white/10 text-muted-foreground'}`}>
                                                        {name}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button onClick={() => setShowViewDialog(false)} className="flex-1 py-3 rounded-2xl border font-bold">Cancel</button>
                                                <button onClick={addView} className="flex-1 py-3 rounded-2xl bg-purple-600 text-white font-bold">Add View</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Footer Actions */}
                        <div className="flex justify-between items-center pt-8 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                                onClick={() => setActiveTab(0)}
                                className="px-6 py-3 rounded-2xl font-bold border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all text-sm"
                            >
                                Back to Basics
                            </button>
                            {isNew && (
                                <button
                                    onClick={() => handleSave(true)}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Finalize & Add Another
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── HELP GUIDE TAB ── */}
                {activeTab === 2 && (
                    <motion.div key="guide" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 space-y-8 shadow-sm"
                    >
                        <SectionHeader title="How it Works: Blank Products" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20">1</div>
                                <h3 className="font-black text-lg">Product Details</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    Set the name and base price of your item. Add color variants (e.g. Black, White) and available sizes. This info shows up in the shop catalog.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20">2</div>
                                <h3 className="font-black text-lg">Upload Mockups</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    In Step 2, add &quot;Views&quot; like Front or Back. Upload a high-quality mockup image for each view. This is what customers will see when designing.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20">3</div>
                                <h3 className="font-black text-lg">Draw Zones</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    <strong>Click and drag</strong> directly on your mockup image to draw &quot;Print Zones&quot;. These zones define exactly where a customer can place their artwork.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-neutral-800">
                            <h4 className="font-bold flex items-center gap-2 mb-3 text-purple-600">
                                <Info className="w-5 h-5" />
                                Optimization Tips
                            </h4>
                            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    Use mockup images with consistent ratios (e.g. 3:4) for a uniform Design Studio experience.
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    You can draw multiple zones on a single view (e.g. Left Chest and Central).
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    The &quot;Locked&quot; feature prevents customers from moving their design outside the rectangle you drew.
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => setActiveTab(0)}
                                className="px-10 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-bold shadow-xl shadow-neutral-500/10 hover:scale-[1.03] transition-transform"
                            >
                                Got it, let&apos;s build!
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Reusable helpers ─────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
    return <h2 className="text-xl font-black">{title}</h2>;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-1.5">{label}</label>
            {children}
        </div>
    );
}
