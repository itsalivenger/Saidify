
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import ProductGallery from "@/components/ProductPage/ProductGallery";
import ProductInfo from "@/components/ProductPage/ProductInfo";
import Breadcrumbs from "@/components/Shop/Breadcrumbs";
import ProductCard from "@/components/Shop/ProductCard";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = PRODUCTS.find((p) => p.id === parseInt(id));

    if (!product) {
        notFound();
    }

    // Mock images for the gallery
    const images = [
        product.image,
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529391409740-59f2dea98080?q=80&w=2600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=2576&auto=format&fit=crop",
    ];

    // Filter related products (exclude current)
    const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

    return (
        <main className="min-h-screen bg-background py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
                <div className="mb-8">
                    <Breadcrumbs />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
                    <ProductGallery images={images} title={product.title} />
                    <ProductInfo product={product} />
                </div>

                {/* Related Products */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
                    <h2 className="text-2xl md:text-3xl font-black mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
