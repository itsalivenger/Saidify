import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { isAdmin } from '@/lib/auth';

export async function GET() {
    try {
        await connectToDatabase();
        const categories = await Category.find({}).sort('name');
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Fetch categories error:', error);
        return NextResponse.json({ message: 'Error fetching categories' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const { name, active, description, image } = await req.json();

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const category = new Category({
            name,
            slug,
            active,
            description,
            image
        });

        await category.save();
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Add category error:', error);
        return NextResponse.json({ message: 'Error adding category' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const { id, name, active, description, image } = await req.json();

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const category = await Category.findByIdAndUpdate(
            id,
            { name, slug, active, description, image },
            { new: true }
        );

        return NextResponse.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        return NextResponse.json({ message: 'Error updating category' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        await Category.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        return NextResponse.json({ message: 'Error deleting category' }, { status: 500 });
    }
}
