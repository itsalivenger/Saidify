import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import BlankProduct from '@/models/BlankProduct';
import { isAdmin } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');
        const category = searchParams.get('category');
        const sortParam = searchParams.get('sort') || 'Newest Arrivals';
        const search = searchParams.get('search');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const size = searchParams.get('size');
        const color = searchParams.get('color');

        // Map sort labels to MongoDB sort objects
        let sort: any = { createdAt: -1 };
        if (sortParam === 'Price: Low to High') sort = { price: 1 };
        else if (sortParam === 'Price: High to Low') sort = { price: -1 };
        else if (sortParam === 'Best Selling') sort = { rating: -1 };

        const query: any = {};
        if (category && category !== 'All' && category !== '') {
            query.category = { $regex: `^${category}$`, $options: 'i' };
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (size && size !== 'All') {
            query.sizes = { $regex: `^${size}$`, $options: 'i' };
        }

        if (color && color !== 'All') {
            query['colors.name'] = { $regex: `^${color}$`, $options: 'i' };
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);

        // Fetch blanks if applicable (no deep filtering by size/color for blanks yet)
        let blanks: any[] = [];
        let totalBlanks = 0;

        // Only fetch blanks if we're on page 1 and no specific product-only filter is active
        // Or if searching/category filtering
        if (page === 1 && !size && !color) {
            const blankQuery: any = { active: true };
            if (category && category !== 'All') blankQuery.category = query.category;
            if (search) blankQuery.name = { $regex: search, $options: 'i' };

            const blankResults = await BlankProduct.find(blankQuery).limit(5); // Show up to 5 templates
            totalBlanks = await BlankProduct.countDocuments(blankQuery);

            blanks = blankResults.map(b => ({
                _id: b._id,
                title: b.name,
                price: b.basePrice,
                category: "Customizable", // Force category or use b.category.name if populated
                image: b.views?.[0]?.mockupImage || "",
                rating: 0,
                isBlank: true
            }));
        }

        const total = totalProducts + totalBlanks;

        return NextResponse.json({
            products: [...blanks, ...products], // Prepend blanks
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Fetch products error:', error);
        return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const body = await req.json();

        const product = new Product(body);
        await product.save();

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Add product error:', error);
        return NextResponse.json({ message: 'Error adding product' }, { status: 500 });
    }
}
