import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ products: [] });
    }

    const searchTerm = query.toLowerCase();

    const filteredProducts = PRODUCTS.filter((product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    return NextResponse.json({ products: filteredProducts });
}
