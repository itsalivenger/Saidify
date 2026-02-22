import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductPage/ProductGallery";
import ProductInfo from "@/components/ProductPage/ProductInfo";
import Breadcrumbs from "@/components/Shop/Breadcrumbs";
import ProductCard from "@/components/Shop/ProductCard";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import BlankProduct from "@/models/BlankProduct";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;

    await connectToDatabase();

    let product: any;
    try {
        product = await Product.findById(id).lean();
        if (!product) {
            const blank = await BlankProduct.findById(id).lean();
            if (blank) {
                product = {
                    ...blank,
                    _id: blank._id,
                    title: blank.name,
                    price: blank.basePrice,
                    isBlank: true,
                    image: blank.views?.[0]?.mockupImage || ""
                };
            }
        }
    } catch (error) {
        console.error("Error finding product:", error);
    }

    if (!product) {
        notFound();
    }

    // Fetch related products from DB
    const relatedProductsRaw = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
    })
        .limit(4)
        .lean();

    const relatedProducts = relatedProductsRaw.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        price: `${p.price.toFixed(2)} MAD`,
        category: p.category,
        rating: p.rating || 0,
        image: p.image
    }));

    // Format main product for component props
    const formattedProduct = {
        id: product._id.toString(),
        title: product.title,
        price: `${product.price.toFixed(2)} MAD`,
        category: product.category,
        rating: product.rating || 0,
        image: product.image,
        description: product.description,
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock || 0,
        isBlank: product.isBlank
    };

    // For now we only have one image from the DB, but component expects an array
    const images = [product.image];

    return (
        <main className="min-h-screen bg-transparent py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
                <div className="mb-8">
                    <Breadcrumbs />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
                    <ProductGallery images={images} title={product.title} />
                    <ProductInfo product={formattedProduct} description={product.description} />
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
