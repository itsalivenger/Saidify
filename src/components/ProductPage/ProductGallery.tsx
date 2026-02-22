"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [showLightbox, setShowLightbox] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 h-fit sticky top-24">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300",
                            selectedImage === index
                                ? "border-purple-500 ring-4 ring-purple-500/10"
                                : "border-transparent hover:border-white/20 bg-white/5"
                        )}
                    >
                        <img
                            src={img}
                            alt={`${title} view ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="flex-1 space-y-4">
                <div
                    ref={containerRef}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                    onMouseMove={handleMouseMove}
                    onClick={() => setShowLightbox(true)}
                    className="relative aspect-square lg:aspect-[4/5] bg-white/5 rounded-3xl overflow-hidden cursor-zoom-in group border border-white/5"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <img
                                src={images[selectedImage]}
                                alt={title}
                                className={cn(
                                    "w-full h-full object-cover transition-transform duration-500",
                                    isZooming ? "scale-150" : "scale-100"
                                )}
                                style={isZooming ? {
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                } : undefined}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Expand Badge */}
                    <div className="absolute bottom-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                        <Maximize2 className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0"
                        onClick={() => setShowLightbox(false)}
                    >
                        <button
                            className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[1001] active:scale-95"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowLightbox(false);
                            }}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div
                            className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-out"
                            onMouseMove={(e) => {
                                if (!isZooming) setIsZooming(true);
                                handleMouseMove(e);
                            }}
                            onMouseLeave={() => setIsZooming(false)}
                        >
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{
                                    scale: isZooming ? 2 : 1,
                                    opacity: 1,
                                    x: isZooming ? (50 - zoomPosition.x) * 2 + '%' : 0,
                                    y: isZooming ? (50 - zoomPosition.y) * 2 + '%' : 0
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                src={images[selectedImage]}
                                alt={title}
                                className="max-w-full max-h-full object-contain pointer-events-none shadow-2xl"
                                style={isZooming ? {
                                    transformOrigin: 'center'
                                } : undefined}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
