
import { PRODUCTS } from "@/lib/products";
import WishlistGrid from "@/components/Wishlist/WishlistGrid";

export default function WishlistPage() {
    // Mocking saved products by taking the first 3
    const savedProducts = PRODUCTS.slice(0, 3);

    return (
        <main className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-[1600px]">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">My Wishlist</h1>
                    <p className="text-muted-foreground">
                        {savedProducts.length} items saved for later
                    </p>
                </div>

                <WishlistGrid products={savedProducts} />
            </div>
        </main>
    );
}
