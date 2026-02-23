'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Upload, Type, Trash2, Loader2, ShoppingCart,
    FlipHorizontal, FlipVertical,
    RotateCcw, RotateCw, Minus, Plus, Layers, Save,
    Check, ImageIcon, Bold, Italic, Globe,
    Undo, Redo
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

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
    const { isAuthenticated } = useAuth();

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
    const [layers, setLayers] = useState<{ id: string; type: string; text?: string; visible: boolean }[]>([]);
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
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [designName, setDesignName] = useState("");
    const [showNamingModal, setShowNamingModal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isPublishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    // History state
    const [history, setHistory] = useState<string[]>([]);
    const [redoStack, setRedoStack] = useState<string[]>([]);
    const isHistoryChange = useRef(false);

    const isAdmin = searchParams.get('admin') === 'true';

    const uploadRef = useRef<HTMLInputElement>(null);
    const uploadingRef = useRef(false);

    const [savedFabricState, setSavedFabricState] = useState<string | null>(null);

    // Update Layers helper
    const updateLayers = useCallback(() => {
        if (!fabricRef.current) return;
        const objs = fabricRef.current.getObjects()
            .filter((o: { selectable: boolean }) => o.selectable)
            .map((o: { id: string; type: string; text?: string; visible: boolean }) => ({
                id: o.id,
                type: o.type,
                text: o.text,
                visible: o.visible,
            }));
        setLayers([...objs].reverse()); // reverse so top layer shows first
    }, []);

    // Save to history helper
    const saveToHistory = useCallback(() => {
        if (!fabricRef.current || isHistoryChange.current) return;
        const json = JSON.stringify(fabricRef.current.toJSON(['id', 'selectable']));
        setHistory(prev => {
            const last = prev[prev.length - 1];
            if (last === json) return prev; // Avoid duplicates
            const next = [...prev, json];
            if (next.length > 50) next.shift();
            return next;
        });
        setRedoStack([]);
    }, []);

    const undo = useCallback(async () => {
        if (!fabricRef.current || history.length <= 1) return;
        isHistoryChange.current = true;

        const current = history[history.length - 1];
        const prev = history[history.length - 2];

        setRedoStack(rs => [...rs, current]);
        setHistory(h => h.slice(0, -1));

        await fabricRef.current.loadFromJSON(JSON.parse(prev));
        fabricRef.current.renderAll();
        updateLayers();
        setTimeout(() => { isHistoryChange.current = false; }, 100);
    }, [history, updateLayers]);

    const redo = useCallback(async () => {
        if (!fabricRef.current || redoStack.length === 0) return;
        isHistoryChange.current = true;

        const next = redoStack[redoStack.length - 1];
        setRedoStack(rs => rs.slice(0, -1));
        setHistory(h => [...h, next]);

        await fabricRef.current.loadFromJSON(JSON.parse(next));
        fabricRef.current.renderAll();
        updateLayers();
        setTimeout(() => { isHistoryChange.current = false; }, 100);
    }, [redoStack, updateLayers]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    if (e.shiftKey) redo();
                    else undo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    redo();
                }
            }
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [undo, redo]);

    // Load product + existing order together so canvas init has everything it needs
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                // Fetch product
                const productRes = await fetch(`/api/blanks/${productId}`);
                if (!productRes.ok || cancelled) return;
                const productData = await productRes.json();

                // Fetch saved design order (if editing an existing draft)
                let fabricStateToLoad: string | null = null;
                let savedName = "";
                if (orderId) {
                    try {
                        const orderRes = await fetch(`/api/design-orders/${orderId}`);
                        if (orderRes.ok && !cancelled) {
                            const orderData = await orderRes.json();
                            fabricStateToLoad = orderData.fabricState || null;
                            savedName = orderData.name || "";
                        }
                    } catch (e) {
                        console.error("Failed to fetch existing order", e);
                    }
                }

                if (cancelled) return;

                // Set all state at once so canvas init happens once with full data
                setProduct(productData);
                setDesignName(savedName);
                setSavedFabricState(fabricStateToLoad);

                if (productData.views?.[0]?.printZones?.[0]) setSelectedZoneId(productData.views[0].printZones[0].id);
                if (productData.variants?.[0]?.sizes?.[0]) setSelectedSize(productData.variants[0].sizes[0]);
            } catch (e) {
                console.error("Fetch failed", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [productId, orderId]);

    // Apply text changes to selected object
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const activeObj = canvas.getActiveObject();
        if (activeObj && activeObj.type === 'text') {
            activeObj.set({
                text: textInput,
                fontFamily: textFont,
                fontSize: textSize,
                fill: textColor,
                fontWeight: textBold ? 'bold' : 'normal',
                fontStyle: textItalic ? 'italic' : 'normal'
            });
            canvas.renderAll();
            updateLayers(); // Ensure layers list reflects text changes (like content)

            // Debounced history save
            const timer = setTimeout(() => {
                saveToHistory();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [textInput, textFont, textSize, textColor, textBold, textItalic, saveToHistory, updateLayers]);

    // Setup Fabric canvas
    useEffect(() => {
        if (!product || !canvasRef.current) return;

        const initFabric = async () => {
            try {
                const { Canvas, FabricImage, Rect } = await import('fabric');
                const container = containerRef.current;
                if (!container) return;

                const size = Math.min(container.clientWidth, 580);

                if (fabricRef.current) {
                    fabricRef.current.dispose();
                    fabricRef.current = null;
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
                        isHistoryChange.current = true;
                        const state = JSON.parse(savedFabricState);
                        // Fabric.js v6: loadFromJSON returns a Promise, no callback param
                        await canvas.loadFromJSON(state);
                        // After load: ensure user-placed objects are selectable
                        canvas.getObjects().forEach((obj: { selectable?: boolean, evented?: boolean, id?: string, type?: string, set: (props: any) => void }) => {
                            // Only fix objects that should be selectable (not mockup/zone)
                            if (obj.selectable !== false) {
                                obj.set({ selectable: true, evented: true });
                                if (!obj.id) obj.set({ id: `${obj.type}-${Date.now()}` });
                            }
                        });
                        canvas.renderAll();
                        updateLayers();
                        setTimeout(() => { isHistoryChange.current = false; }, 200);
                    } catch (e) {
                        console.error("Failed to load saved state", e);
                        isHistoryChange.current = false;
                    }
                }

                // Object selection tracking
                canvas.on('selection:created', (e: any) => {
                    const obj = e.selected?.[0];
                    if (obj) {
                        setSelectedObjId(obj.id || null);
                        if (obj.type === 'text') {
                            setTextInput(obj.text || '');
                            setTextFont(obj.fontFamily || 'Inter');
                            setTextSize(obj.fontSize || 40);
                            setTextColor(obj.fill as string || '#000000');
                            setTextBold(obj.fontWeight === 'bold');
                            setTextItalic(obj.fontStyle === 'italic');
                            setActivePanel('text');
                        }
                    }
                });
                canvas.on('selection:updated', (e: any) => {
                    const obj = e.selected?.[0];
                    if (obj) {
                        setSelectedObjId(obj.id || null);
                        if (obj.type === 'text') {
                            setTextInput(obj.text || '');
                            setTextFont(obj.fontFamily || 'Inter');
                            setTextSize(obj.fontSize || 40);
                            setTextColor(obj.fill as string || '#000000');
                            setTextBold(obj.fontWeight === 'bold');
                            setTextItalic(obj.fontStyle === 'italic');
                        }
                    }
                });
                canvas.on('selection:cleared', () => {
                    setSelectedObjId(null);
                });

                // Clamping Logic
                const clampObject = (obj: any) => {
                    const bounds = (canvas as any)._printZoneBounds;
                    if (!obj || !bounds || !obj.selectable) return;
                    const { zx, zy, zw, zh } = bounds;

                    const objBounds = obj.getBoundingRect();

                    // Clamp scaling if it exceeds zone
                    if (objBounds.width > zw || objBounds.height > zh) {
                        const scaleRatio = Math.min(zw / (objBounds.width / obj.scaleX), zh / (objBounds.height / obj.scaleY));
                        obj.set({ scaleX: scaleRatio, scaleY: scaleRatio });
                        obj.setCoords();
                    }

                    const newObjBounds = obj.getBoundingRect();
                    let left = obj.left!;
                    let top = obj.top!;

                    if (newObjBounds.left < zx) left += zx - newObjBounds.left;
                    if (newObjBounds.top < zy) top += zy - newObjBounds.top;
                    if (newObjBounds.left + newObjBounds.width > zx + zw) left -= (newObjBounds.left + newObjBounds.width) - (zx + zw);
                    if (newObjBounds.top + newObjBounds.height > zy + zh) top -= (newObjBounds.top + newObjBounds.height) - (zy + zh);

                    obj.set({ left, top });
                    obj.setCoords();
                };

                canvas.on('object:moving', (e: any) => clampObject(e.target));
                canvas.on('object:scaling', (e: any) => clampObject(e.target));
                canvas.on('object:modified', (e: any) => clampObject(e.target));

                canvas.on('object:added', () => { updateLayers(); saveToHistory(); });
                canvas.on('object:removed', () => { updateLayers(); saveToHistory(); });
                canvas.on('object:modified', () => { updateLayers(); saveToHistory(); });

                // Save initial state if not already in history
                if (!savedFabricState) {
                    setHistory(h => h.length === 0 ? [JSON.stringify((canvas as any).toJSON(['id', 'selectable']))] : h);
                } else {
                    setHistory([savedFabricState]);
                }

                canvas.renderAll();
                updateLayers();
            } catch (err) {
                console.error("Canvas init failed:", err);
            } finally {
                setLoading(false);
            }
        };

        initFabric();

        return () => {
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }
        };
    }, [product, selectedViewIdx, selectedZoneId, savedFabricState, updateLayers, saveToHistory]);



    // ── Upload image ──
    const uploadImage = async (file: File) => {
        if (uploadingRef.current || !fabricRef.current) return;
        uploadingRef.current = true;

        const { FabricImage } = await import('fabric');
        const url = URL.createObjectURL(file);
        const canvas = fabricRef.current;
        const bounds = canvas._printZoneBounds;

        try {
            const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
            const zw = bounds?.zw || canvas.width! * 0.6;
            const zh = bounds?.zh || canvas.height! * 0.6;

            const scale = Math.min(
                (zw * 0.8) / img.width!,
                (zh * 0.8) / img.height!,
                1
            );
            img.set({ scaleX: scale, scaleY: scale });

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
            updateLayers();
            saveToHistory();
        } catch (e) {
            console.error('Image upload error', e);
        } finally {
            uploadingRef.current = false;
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadImage(file);
            if (uploadRef.current) uploadRef.current.value = '';
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            await uploadImage(file);
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

        // Ensure text fits initially
        if (bounds) {
            const tw = text.width!;
            const th = text.height!;
            if (tw > bounds.zw * 0.9 || th > bounds.zh * 0.9) {
                const scale = Math.min((bounds.zw * 0.9) / tw, (bounds.zh * 0.9) / th);
                text.set({ scaleX: scale, scaleY: scale });
            }
        }

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

        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        if (!designName) {
            setShowNamingModal(true);
            return;
        }

        setSaving(true);
        const fabricState = JSON.stringify(fabricRef.current.toJSON(['id', 'selectable']));
        const thumbnail = fabricRef.current.toDataURL({ format: 'png', quality: 0.7 });

        try {
            const method = orderId ? 'PUT' : 'POST';
            const url = orderId ? `/api/design-orders/${orderId}` : '/api/design-orders';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: designName,
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

            if (res.ok && !orderId) {
                const data = await res.json();
                // Update URL with orderId to allow smooth subsequent saves
                router.replace(`/design/${product._id}?orderId=${data._id}`);
            }

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
                    title: `Designed ${product.name} `,
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
                    title: `Custom ${product.name} `,
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

    const resetCanvas = useCallback(async () => {
        if (!fabricRef.current || history.length === 0) return;
        if (!confirm('Are you sure you want to reset your design? All changes will be lost.')) return;

        isHistoryChange.current = true;
        const initialState = history[0];
        setHistory([initialState]);
        setRedoStack([]);

        await fabricRef.current.loadFromJSON(JSON.parse(initialState));
        fabricRef.current.renderAll();
        updateLayers();
        setTimeout(() => { isHistoryChange.current = false; }, 100);
    }, [history, updateLayers]);

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
        <div
            className="h-[calc(100vh-96px)] bg-neutral-50 dark:bg-neutral-950 flex flex-col overflow-hidden"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
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

                {/* History & Controls */}
                <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-white/5 rounded-2xl">
                    <button onClick={undo} disabled={history.length <= 1}
                        title="Undo (Ctrl+Z)"
                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none">
                        <Undo className="w-4 h-4" />
                    </button>
                    <button onClick={redo} disabled={redoStack.length === 0}
                        title="Redo (Ctrl+Y)"
                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none">
                        <Redo className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
                    <button onClick={resetCanvas}
                        title="Reset Design"
                        className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all flex items-center gap-2 text-xs font-bold">
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden md:inline">Reset</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={handlePublishProduct} disabled={isPublishing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all ${published ? 'bg-emerald-500 text-white border-transparent' : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                                } `}>
                            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : published ? <Check className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                            {published ? 'Published!' : 'Publish to Shop'}
                        </button>
                    )}
                    <button onClick={handleSaveDraft} disabled={saving}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all ${saved ? 'border-emerald-500 text-emerald-600' : 'border-neutral-200 dark:border-neutral-700 hover:border-purple-500/50'
                            } `}>
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
                                            className={`w-9 h-9 rounded-full border-2 transition-all ${selectedVariant === i ? 'border-purple-500 scale-110 shadow-md' : 'border-white dark:border-neutral-800 shadow-sm hover:scale-110'} `}
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
                                                } `}>
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
                                                } `}>
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
                                                } `}>
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
                                    } `}>
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
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => uploadRef.current?.click()}
                                        className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-8 text-center transition-all ${isDragging ? 'border-purple-500 bg-purple-500/5 scale-[0.98]' : 'border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 hover:bg-neutral-50 dark:hover:bg-white/5'} `}
                                    >
                                        <div className={`w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${isDragging ? 'scale-110 animate-pulse' : ''} `}>
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-black mb-1">Click or Drop</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Image File</p>

                                        {isDragging && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-purple-600/10 backdrop-blur-[2px] rounded-[2rem] pointer-events-none">
                                                <p className="text-purple-600 font-black text-xs uppercase tracking-[0.2em] animate-bounce">Drop Image Here</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-center mt-2">
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
                                        <div className="grid grid-cols-4 gap-2">
                                            {FONTS.map(f => (
                                                <button key={f} onClick={() => setTextFont(f)}
                                                    style={{ fontFamily: f }}
                                                    className={`px-2 py-3 border rounded-xl text-xs transition-all ${textFont === f ? 'border-purple-600 bg-purple-500/5 text-purple-600' : 'border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50'} `}>
                                                    Abc
                                                </button>
                                            ))}
                                        </div>
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
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-sm border transition-all ${textBold ? 'bg-purple-600 text-white border-transparent' : 'border-neutral-200 dark:border-neutral-700'} `}>
                                            <Bold className="w-4 h-4" /> Bold
                                        </button>
                                        <button onClick={() => setTextItalic(!textItalic)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-sm border transition-all ${textItalic ? 'bg-purple-600 text-white border-transparent' : 'border-neutral-200 dark:border-neutral-700'} `}>
                                            <Italic className="w-4 h-4" /> Italic
                                        </button>
                                    </div>
                                    {selectedObjId ? (
                                        <button onClick={() => { fabricRef.current?.discardActiveObject(); fabricRef.current?.renderAll(); setSelectedObjId(null); }}
                                            className="w-full py-3 bg-neutral-100 dark:bg-white/5 text-muted-foreground rounded-2xl font-bold text-sm hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                            Deselect to Add New Text
                                        </button>
                                    ) : (
                                        <button onClick={handleAddText}
                                            className="w-full py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" /> Add Text to Canvas
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* Layers Panel */}
                            {activePanel === 'layers' && (
                                <motion.div key="layers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {layers.length === 0 ? 'No layers yet. Upload an image or add text.' : `${layers.length} layer${layers.length !== 1 ? 's' : ''} `}
                                    </p>
                                    {layers.map((layer, i) => (
                                        <div key={layer.id || i}
                                            className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${selectedObjId === layer.id
                                                ? 'border-purple-500 bg-purple-500/5'
                                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                                                } `}
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
                                                {layer.type === 'text' ? layer.text : `Image ${layers.length - i} `}
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
            {/* Auth Required Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-neutral-900 rounded-[32px] p-8 w-full max-w-sm shadow-2xl border border-neutral-200 dark:border-neutral-800 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto mb-6">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Account Required</h3>
                            <p className="text-muted-foreground mb-8 text-sm">
                                Please login or create an account to save your designs and access them later.
                            </p>
                            <div className="space-y-3">
                                <Link href="/login"
                                    className="block w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20">
                                    Login
                                </Link>
                                <Link href="/signup"
                                    className="block w-full py-4 bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 rounded-2xl font-bold hover:bg-neutral-50 dark:hover:bg-white/5 transition-all">
                                    Create Account
                                </Link>
                                <button onClick={() => setShowAuthModal(false)}
                                    className="block w-full py-3 text-muted-foreground text-xs font-bold hover:text-foreground transition-all">
                                    Maybe later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Naming Modal */}
            <AnimatePresence>
                {showNamingModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-neutral-900 rounded-[32px] p-8 w-full max-w-sm shadow-2xl border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-2xl font-black mb-2 text-center">Name your design</h3>
                            <p className="text-muted-foreground mb-6 text-sm text-center">
                                Give your masterpiece a name to find it easily later.
                            </p>
                            <div className="space-y-4">
                                <input
                                    autoFocus
                                    value={designName}
                                    onChange={(e) => setDesignName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && designName && (setShowNamingModal(false), setTimeout(handleSaveDraft, 100))}
                                    placeholder="e.g. My Cool Hoodie"
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-black focus:border-purple-500 outline-none transition-all font-bold"
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowNamingModal(false)}
                                        className="flex-1 py-4 text-muted-foreground font-bold hover:text-foreground transition-all">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!designName) return;
                                            setShowNamingModal(false);
                                            setTimeout(handleSaveDraft, 100);
                                        }}
                                        disabled={!designName}
                                        className="flex-[2] py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50">
                                        Save Design
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
