import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
// import { getServerSession } from 'next-auth'; // Use this if you have next-auth setup

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
            query.sizes = size;
        }

        if (color && color !== 'All') {
            query['colors.name'] = color;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        return NextResponse.json({
            products,
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
        await connectToDatabase();
        // In a real app, verify admin session/token here
        const body = await req.json();

        const product = new Product(body);
        await product.save();

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Add product error:', error);
        return NextResponse.json({ message: 'Error adding product' }, { status: 500 });
    }
}
