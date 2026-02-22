'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Upload, Type, Trash2, Loader2, ShoppingCart,
    ChevronLeft, ChevronRight, FlipHorizontal, FlipVertical,
    RotateCcw, RotateCw, Minus, Plus, Layers, Save,
    Check, ImageIcon, AlignCenter, Bold, Italic, Globe
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────────────
interface PrintZone {
    id: string;
    label: string;
    x: number; y: number;
    width: number; height: number;
    maxLayers: number;
    locked: boolean;
}
interface ProductView {
    name: string;
    mockupImage: string;
    printZones: PrintZone[];
}
interface Variant {
    color: string; colorHex: string; sizes: string[]; available: boolean;
}
interface BlankProduct {
    _id: string; name: string; description: string; basePrice: number;
    variants: Variant[]; views: ProductView[];
    allowText: boolean; allowMultipleZones: boolean;
}

const FONTS = ['Inter', 'Georgia', 'Courier New', 'Impact', 'Arial', 'Verdana', 'Times New Roman'];

// ─── Studio Component ───────────────────────────────────────────────────────
export default function DesignStudioEditor() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = params.productId as string;
    const orderId = searchParams.get('orderId');
    const { addToCart } = useCart();

    // Product state
    const [product, setProduct] = useState<BlankProduct | null>(null);
    const [loading, setLoading] = useState(true);

    // Selections
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [selectedViewIdx, setSelectedViewIdx] = useState(0);
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState('');

    // Canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Tool panel state
    const [activePanel, setActivePanel] = useState<'layers' | 'text' | 'upload'>('layers');
    const [layers, setLayers] = useState<any[]>([]);
    const [selectedObjId, setSelectedObjId] = useState<string | null>(null);

    // Text tool state
    const [textInput, setTextInput] = useState('Your Text');
    const [textFont, setTextFont] = useState('Inter');
    const [textSize, setTextSize] = useState(40);
    const [textColor, setTextColor] = useState('#000000');
    const [textBold, setTextBold] = useState(false);
    const [textItalic, setTextItalic] = useState(false);

    // Saving
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    const isAdmin = searchParams.get('admin') === 'true';

    const uploadRef = useRef<HTMLInputElement>(null);
    const uploadingRef = useRef(false);

    const [savedFabricState, setSavedFabricState] = useState<string | null>(null);

    // Load product
    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`/api/blanks/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setProduct(data);
                if (data.views?.[0]?.printZones?.[0]) setSelectedZoneId(data.views[0].printZones[0].id);
                if (data.variants?.[0]?.sizes?.[0]) setSelectedSize(data.variants[0].sizes[0]);
            }
        };

        const fetchExistingOrder = async () => {
            if (!orderId) return;
            try {
                const res = await fetch(`/api/design-orders/${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSavedFabricState(data.fabricState);
                }
            } catch (e) {
                console.error("Failed to fetch existing order", e);
            }
        };

        fetchProduct();
        fetchExistingOrder();
    }, [productId, orderId]);

    // Apply saved variant/size when product and design are loaded
    useEffect(() => {
        if (!product || !savedFabricState || !orderId) return;

        const applyDesignMeta = async () => {
            const res = await fetch(`/api/design-orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.selectedVariant) {
                    const idx = product.variants.findIndex(v => v.color === data.selectedVariant.color);
                    if (idx !== -1) setSelectedVariant(idx);
                    setSelectedSize(data.selectedVariant.size);
                }
            }
        }
        applyDesignMeta();
    }, [product, savedFabricState, orderId]);

    const updateLayers = useCallback(() => {
        if (!fabricRef.current) return;
        const objs = fabricRef.current.getObjects()
            .filter((o: any) => o.selectable)
            .map((o: any) => ({
                id: o.id,
                type: o.type,
                text: o.text,
                visible: o.visible,
            }));
        setLayers([...objs].reverse()); // reverse so top layer shows first
    }, []);

    // Setup Fabric canvas
    useEffect(() => {
        if (!product || !canvasRef.current) return;

        const initFabric = async () => {
            const { Canvas, FabricImage, Rect } = await import('fabric');
            const container = containerRef.current;
            if (!container) return;

            const size = Math.min(container.clientWidth, 580);

            if (fabricRef.current) {
                fabricRef.current.dispose();
            }

            const canvas = new Canvas(canvasRef.current!, {
                width: size,
                height: size,
                backgroundColor: '#f8f8f8',
                selection: true,
            });
            fabricRef.current = canvas;

            const view = product.views[selectedViewIdx];
            if (!view) return;

            // Draw mockup as non-selectable background
            if (view.mockupImage) {
                try {
                    const img = await FabricImage.fromURL(view.mockupImage, { crossOrigin: 'anonymous' });
                    img.scaleToWidth(size);
                    img.scaleToHeight(size);
                    img.set({ selectable: false, evented: false, left: 0, top: 0 });
                    canvas.add(img);
                    canvas.sendObjectToBack(img);
                } catch (e) {
                    console.warn('Mockup load error', e);
                }
            }

            // Draw print zone overlays (non-selectable guides)
            const zone = view.printZones?.find(z => z.id === selectedZoneId) || view.printZones?.[0];
            if (zone) {
                const zx = (zone.x / 100) * size;
                const zy = (zone.y / 100) * size;
                const zw = (zone.width / 100) * size;
                const zh = (zone.height / 100) * size;

                const zoneRect = new Rect({
                    left: zx, top: zy, width: zw, height: zh,
                    fill: 'rgba(147,51,234,0.06)',
                    stroke: '#9333ea',
                    strokeWidth: 1.5,
                    strokeDashArray: [6, 4],
                    selectable: false, evented: false,
                    rx: 4, ry: 4,
                });
                canvas.add(zoneRect);

                // Clipping logic: restrict objects added after this to zone bounds
                (canvas as any)._printZoneBounds = { zx, zy, zw, zh };
            }

            // Load saved state if any
            if (savedFabricState) {
                try {
                    await canvas.loadFromJSON(JSON.parse(savedFabricState));
                } catch (e) {
                    console.error("Failed to load saved state", e);
                }
            }

            // Object selection tracking
            canvas.on('selection:created', (e: any) => {
                const obj = e.selected?.[0];
                if (obj) setSelectedObjId(obj.id || null);
            });
            canvas.on('selection:updated', (e: any) => {
                const obj = e.selected?.[0];
                if (obj) setSelectedObjId(obj.id || null);
            });
            canvas.on('selection:cleared', () => setSelectedObjId(null));

            // On object moved — clamp back into zone
            canvas.on('object:modified', (e: any) => {
                const obj = e.target;
                const bounds = (canvas as any)._printZoneBounds;
                if (!obj || !bounds || !obj.selectable) return;
                const { zx, zy, zw, zh } = bounds;
                const objBounds = obj.getBoundingRect();
                let left = obj.left!;
                let top = obj.top!;
                if (objBounds.left < zx) left += zx - objBounds.left;
                if (objBounds.top < zy) top += zy - objBounds.top;
                if (objBounds.left + objBounds.width > zx + zw) left -= (objBounds.left + objBounds.width) - (zx + zw);
                if (objBounds.top + objBounds.height > zy + zh) top -= (objBounds.top + objBounds.height) - (zy + zh);
                obj.set({ left, top });
                obj.setCoords();
                canvas.renderAll();
            });

            canvas.on('object:added', updateLayers);
            canvas.on('object:removed', updateLayers);
            canvas.on('object:modified', updateLayers);

            canvas.renderAll();
            updateLayers();
            setLoading(false);
        };

        initFabric();

        return () => {
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }
        };
    }, [product, selectedViewIdx, selectedZoneId, savedFabricState, updateLayers]);



    // ── Upload image ──
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || uploadingRef.current || !fabricRef.current) return;
        uploadingRef.current = true;

        const { FabricImage } = await import('fabric');
        const url = URL.createObjectURL(file);
        const canvas = fabricRef.current;
        const bounds = canvas._printZoneBounds;

        try {
            const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
            const zw = bounds?.zw || canvas.width! * 0.6;
            const zh = bounds?.zh || canvas.height! * 0.6;
            img.scaleToWidth(Math.min(img.width!, zw * 0.8));
            if (img.getScaledHeight() > zh * 0.8) img.scaleToHeight(zh * 0.8);

            const cx = bounds ? bounds.zx + bounds.zw / 2 : canvas.width! / 2;
            const cy = bounds ? bounds.zy + bounds.zh / 2 : canvas.height! / 2;
            img.set({
                left: cx - img.getScaledWidth() / 2,
                top: cy - img.getScaledHeight() / 2,
                selectable: true,
                id: `img-${Date.now()}`,
            } as any);
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
        } catch (e) {
            console.error('Image upload error', e);
        } finally {
            uploadingRef.current = false;
            if (uploadRef.current) uploadRef.current.value = '';
        }
    };

    // ── Add text ──
    const handleAddText = async () => {
        if (!fabricRef.current) return;
        const { FabricText } = await import('fabric');
        const canvas = fabricRef.current;
        const bounds = canvas._printZoneBounds;
        const cx = bounds ? bounds.zx + bounds.zw / 2 : canvas.width! / 2;
        const cy = bounds ? bounds.zy + bounds.zh / 2 : canvas.height! / 2;

        const text = new FabricText(textInput || 'Your Text', {
            left: cx,
            top: cy,
            originX: 'center',
            originY: 'center',
            fontFamily: textFont,
            fontSize: textSize,
            fill: textColor,
            fontWeight: textBold ? 'bold' : 'normal',
            fontStyle: textItalic ? 'italic' : 'normal',
            selectable: true,
            id: `text-${Date.now()}`,
        } as any);
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    // ── Object actions ──
    const deleteSelected = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (obj) { canvas.remove(obj); canvas.renderAll(); }
    };

    const flipObj = (dir: 'x' | 'y') => {
        const obj = fabricRef.current?.getActiveObject();
        if (!obj) return;
        if (dir === 'x') obj.set('flipX', !obj.flipX);
        else obj.set('flipY', !obj.flipY);
        fabricRef.current.renderAll();
    };

    const rotateObj = (deg: number) => {
        const obj = fabricRef.current?.getActiveObject();
        if (!obj) return;
        obj.set('angle', ((obj.angle || 0) + deg) % 360);
        fabricRef.current.renderAll();
    };

    const changeOpacity = (delta: number) => {
        const obj = fabricRef.current?.getActiveObject();
        if (!obj) return;
        const newOpacity = Math.max(0.1, Math.min(1, (obj.opacity || 1) + delta));
        obj.set('opacity', newOpacity);
        fabricRef.current.renderAll();
    };

    const toggleLayerVisibility = (id: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const obj = canvas.getObjects().find((o: any) => o.id === id);
        if (obj) { obj.set('visible', !obj.visible); canvas.renderAll(); updateLayers(); }
    };

    const deleteLayer = (id: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const obj = canvas.getObjects().find((o: any) => o.id === id);
        if (obj) { canvas.remove(obj); canvas.renderAll(); }
    };

    // ── Save draft ──
    const handleSaveDraft = async () => {
        if (!fabricRef.current || !product) return;
        setSaving(true);
        const fabricState = JSON.stringify(fabricRef.current.toJSON(['id', 'selectable']));
        const thumbnail = fabricRef.current.toDataURL({ format: 'png', quality: 0.7 });

        try {
            const method = orderId ? 'PUT' : 'POST';
            const url = orderId ? `/api/design-orders/${orderId}` : '/api/design-orders';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blankProduct: product._id,
                    selectedVariant: {
                        color: product.variants[selectedVariant]?.color || '',
                        colorHex: product.variants[selectedVariant]?.colorHex || '#ffffff',
                        size: selectedSize,
                    },
                    fabricState,
                    thumbnail,
                    status: 'draft',
                    totalPrice: product.basePrice,
                }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    // ── Publish as Product (Admin Only) ──
    const handlePublishProduct = async () => {
        if (!fabricRef.current || !product || !isAdmin) return;
        setPublishing(true);
        const fabricState = JSON.stringify(fabricRef.current.toJSON(['id', 'selectable']));
        const thumbnail = fabricRef.current.toDataURL({ format: 'png', quality: 0.9 });

        try {
            const res = await fetch(`/api/design-orders/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blankProductId: product._id,
                    selectedVariant: {
                        color: product.variants[selectedVariant]?.color || '',
                        colorHex: product.variants[selectedVariant]?.colorHex || '#ffffff',
                    },
                    fabricState,
                    thumbnail,
                    price: product.basePrice,
                    title: `Designed ${product.name}`,
                    description: `A custom designed version of our ${product.name}.`
                }),
            });

            if (res.ok) {
                setPublished(true);
                setTimeout(() => setPublished(false), 3000);
                // Optionally redirect to the new product page
            }
        } catch (e) {
            console.error(e);
        } finally {
            setPublishing(false);
        }
    };

    // ── Submit order ──
    const handleSubmitOrder = async () => {
        if (!fabricRef.current || !product) return;
        setSubmitting(true);
        const fabricState = JSON.stringify(fabricRef.current.toJSON(['id', 'selectable']));
        const thumbnail = fabricRef.current.toDataURL({ format: 'png', quality: 0.85 });

        try {
            const method = orderId ? 'PUT' : 'POST';
            const url = orderId ? `/api/design-orders/${orderId}` : '/api/design-orders';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blankProduct: product._id,
                    selectedVariant: {
                        color: product.variants[selectedVariant]?.color || '',
                        colorHex: product.variants[selectedVariant]?.colorHex || '#ffffff',
                        size: selectedSize,
                    },
                    fabricState,
                    thumbnail,
                    status: 'pending',
                    totalPrice: product.basePrice,
                }),
            });

            if (res.ok) {
                const designOrder = await res.json();

                // Add to real shopping cart
                addToCart({
                    id: product._id,
                    title: `Custom ${product.name}`,
                    price: product.basePrice.toString(),
                    image: thumbnail, // Use the custom design thumbnail
                    quantity: 1,
                    selectedSize: selectedSize,
                    selectedColor: product.variants[selectedVariant]?.color || '',
                    designOrderId: designOrder._id
                });

                router.push('/cart');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
    );

    if (!product) return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <p className="text-xl font-bold">Product not found</p>
            <Link href="/design" className="text-purple-600 underline">Back to Design Studio</Link>
        </div>
    );

    const currentView = product.views[selectedViewIdx];
    const currentVariant = product.variants[selectedVariant];
    const currentZone = currentView?.printZones?.find(z => z.id === selectedZoneId) || currentView?.printZones?.[0];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
            <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

            {/* Top Bar */}
            <div className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/design" className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-black text-lg leading-tight">{product.name}</h1>
                        {currentVariant && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full inline-block border border-white shadow-sm" style={{ backgroundColor: currentVariant.colorHex }} />
                                {currentVariant.color} · {selectedSize || '—'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={handlePublishProduct} disabled={publishing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all ${published ? 'bg-emerald-500 text-white border-transparent' : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                                }`}>
                            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : published ? <Check className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                            {published ? 'Published!' : 'Publish to Shop'}
                        </button>
                    )}
                    <button onClick={handleSaveDraft} disabled={saving}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all ${saved ? 'border-emerald-500 text-emerald-600' : 'border-neutral-200 dark:border-neutral-700 hover:border-purple-500/50'
                            }`}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? 'Saved' : 'Save Draft'}
                    </button>
                    <button onClick={handleSubmitOrder} disabled={submitting}
                        className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                        Place Order
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel — Config */}
                <div className="w-72 flex-shrink-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col overflow-y-auto">
                    <div className="p-5 space-y-6">
                        {/* Color Variant */}
                        {product.variants.length > 0 && (
                            <div>
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 block">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((v, i) => (
                                        <button key={i} onClick={() => setSelectedVariant(i)}
                                            title={v.color}
                                            className={`w-9 h-9 rounded-full border-2 transition-all ${selectedVariant === i ? 'border-purple-500 scale-110 shadow-md' : 'border-white dark:border-neutral-800 shadow-sm hover:scale-110'}`}
                                            style={{ backgroundColor: v.colorHex }} />
                                    ))}
                                </div>
                                {currentVariant && (
                                    <p className="text-xs font-bold mt-2 text-muted-foreground">{currentVariant.color}</p>
                                )}
                            </div>
                        )}

                        {/* Size */}
                        {currentVariant?.sizes?.length > 0 && (
                            <div>
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 block">Size</label>
                                <div className="flex flex-wrap gap-2">
                                    {currentVariant.sizes.map(s => (
                                        <button key={s} onClick={() => setSelectedSize(s)}
                                            className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all border ${selectedSize === s
                                                ? 'bg-purple-600 text-white border-transparent'
                                                : 'bg-transparent border-neutral-200 dark:border-neutral-700 hover:border-purple-500/50'
                                                }`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* View Selector */}
                        {product.views.length > 1 && (
                            <div>
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 block">View</label>
                                <div className="flex gap-2 flex-wrap">
                                    {product.views.map((v, i) => (
                                        <button key={i} onClick={() => setSelectedViewIdx(i)}
                                            className={`px-3 py-2 rounded-xl font-bold text-sm transition-all border ${selectedViewIdx === i
                                                ? 'bg-purple-600 text-white border-transparent'
                                                : 'border-neutral-200 dark:border-neutral-700'
                                                }`}>
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Zone Selector */}
                        {currentView?.printZones?.length > 1 && (
                            <div>
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 block">Print Zone</label>
                                <div className="space-y-1">
                                    {currentView.printZones.map(z => (
                                        <button key={z.id} onClick={() => setSelectedZoneId(z.id)}
                                            className={`w-full px-3 py-2 rounded-xl font-bold text-sm text-left flex items-center justify-between transition-all ${selectedZoneId === z.id
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10'
                                                }`}>
                                            <span>{z.label}</span>
                                            {z.locked && <span className="text-xs opacity-70">Locked</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price */}
                        <div className="p-4 bg-purple-500/10 rounded-2xl">
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Base Price</p>
                            <p className="text-2xl font-black text-purple-600">{product.basePrice} MAD</p>
                        </div>
                    </div>
                </div>

                {/* Centre — Canvas */}
                <div className="flex-1 flex flex-col items-center justify-start p-8 overflow-auto bg-neutral-100 dark:bg-neutral-950">
                    {/* Zone Info Banner */}
                    {currentZone && (
                        <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-bold text-purple-700 dark:text-purple-300">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            Zone: {currentZone.label}
                        </div>
                    )}

                    <div ref={containerRef} className="relative">
                        <canvas ref={canvasRef} className="rounded-2xl shadow-2xl" />
                    </div>

                    {/* Object Toolbar (shows when something is selected) */}
                    {selectedObjId && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 shadow-lg"
                        >
                            <ToolBtn onClick={() => flipObj('x')} icon={FlipHorizontal} label="Flip H" />
                            <ToolBtn onClick={() => flipObj('y')} icon={FlipVertical} label="Flip V" />
                            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
                            <ToolBtn onClick={() => rotateObj(-15)} icon={RotateCcw} label="-15°" />
                            <ToolBtn onClick={() => rotateObj(15)} icon={RotateCw} label="+15°" />
                            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
                            <ToolBtn onClick={() => changeOpacity(-0.1)} icon={Minus} label="Opacity" />
                            <ToolBtn onClick={() => changeOpacity(0.1)} icon={Plus} label="Opacity" />
                            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
                            <button onClick={deleteSelected}
                                className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Right Panel — Tools */}
                <div className="w-72 flex-shrink-0 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden">
                    {/* Panel Switcher */}
                    <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                        {[
                            { key: 'upload', icon: ImageIcon, label: 'Image' },
                            ...(product.allowText ? [{ key: 'text', icon: Type, label: 'Text' }] : []),
                            { key: 'layers', icon: Layers, label: 'Layers' },
                        ].map(tab => (
                            <button key={tab.key}
                                onClick={() => setActivePanel(tab.key as any)}
                                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-bold transition-all ${activePanel === tab.key
                                    ? 'text-purple-600 border-b-2 border-purple-600'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}>
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <AnimatePresence mode="wait">

                            {/* Upload Panel */}
                            {activePanel === 'upload' && (
                                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                                    <p className="text-xs text-muted-foreground">Upload an image to place on your product. PNG with transparent background works best.</p>
                                    <button onClick={() => uploadRef.current?.click()}
                                        className="w-full flex flex-col items-center gap-3 py-10 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-sm">Click to Upload</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WEBP</p>
                                        </div>
                                    </button>
                                    <p className="text-xs text-muted-foreground text-center">
                                        💡 Use a PNG with transparent background for best results
                                    </p>
                                </motion.div>
                            )}

                            {/* Text Panel */}
                            {activePanel === 'text' && (
                                <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground block mb-1.5">Text Content</label>
                                        <input value={textInput} onChange={e => setTextInput(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border text-sm" placeholder="Enter your text..." />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground block mb-1.5">Font</label>
                                        <select value={textFont} onChange={e => setTextFont(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border text-sm bg-white dark:bg-neutral-900">
                                            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground block mb-1.5">Size</label>
                                            <input type="number" min={10} max={200} value={textSize}
                                                onChange={e => setTextSize(parseInt(e.target.value))}
                                                className="w-full px-3 py-2 rounded-xl border text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground block mb-1.5">Color</label>
                                            <input type="color" value={textColor}
                                                onChange={e => setTextColor(e.target.value)}
                                                className="w-full h-10 rounded-xl border cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setTextBold(!textBold)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-sm border transition-all ${textBold ? 'bg-purple-600 text-white border-transparent' : 'border-neutral-200 dark:border-neutral-700'}`}>
                                            <Bold className="w-4 h-4" /> Bold
                                        </button>
                                        <button onClick={() => setTextItalic(!textItalic)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-sm border transition-all ${textItalic ? 'bg-purple-600 text-white border-transparent' : 'border-neutral-200 dark:border-neutral-700'}`}>
                                            <Italic className="w-4 h-4" /> Italic
                                        </button>
                                    </div>
                                    <button onClick={handleAddText}
                                        className="w-full py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> Add Text to Canvas
                                    </button>
                                </motion.div>
                            )}

                            {/* Layers Panel */}
                            {activePanel === 'layers' && (
                                <motion.div key="layers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {layers.length === 0 ? 'No layers yet. Upload an image or add text.' : `${layers.length} layer${layers.length !== 1 ? 's' : ''}`}
                                    </p>
                                    {layers.map((layer, i) => (
                                        <div key={layer.id || i}
                                            className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${selectedObjId === layer.id
                                                ? 'border-purple-500 bg-purple-500/5'
                                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                                                }`}
                                            onClick={() => {
                                                const canvas = fabricRef.current;
                                                if (!canvas) return;
                                                const obj = canvas.getObjects().find((o: any) => o.id === layer.id);
                                                if (obj) { canvas.setActiveObject(obj); canvas.renderAll(); setSelectedObjId(layer.id); }
                                            }}>
                                            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                                                {layer.type === 'image' ? <ImageIcon className="w-4 h-4 text-muted-foreground" /> : <Type className="w-4 h-4 text-muted-foreground" />}
                                            </div>
                                            <span className="flex-1 text-sm font-bold truncate">
                                                {layer.type === 'text' ? layer.text : `Image ${layers.length - i}`}
                                            </span>
                                            <button onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                                                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolBtn({ onClick, icon: Icon, label }: { onClick: () => void; icon: any; label: string }) {
    return (
        <button onClick={onClick} title={label}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}
