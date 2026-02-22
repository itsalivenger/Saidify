import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        // 1. Total Products
        const totalProducts = await Product.countDocuments();

        // 2. Active Users (Clients)
        const totalClients = await User.countDocuments({ role: { $ne: 'admin' } });

        // 3. Weekly Revenue & Total Orders
        // Let's get total revenue from non-cancelled orders
        const confirmedOrders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalOrders = confirmedOrders.length;
        const totalRevenue = confirmedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // 4. Recent Activity (Recent 5 confirmed orders)
        const recentActivity = await Order.find({ status: { $ne: 'cancelled' } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');

        // Formatted statistics for the dashboard
        const stats = [
            {
                name: 'Total Products',
                value: totalProducts.toLocaleString(),
                icon: 'Package',
                color: 'from-blue-600/20 to-blue-600/5',
                iconColor: 'text-blue-500',
                trend: 'In Stock'
            },
            {
                name: 'Total Clients',
                value: totalClients.toLocaleString(),
                icon: 'Users',
                color: 'from-purple-600/20 to-purple-600/5',
                iconColor: 'text-purple-500',
                trend: 'Active'
            },
            {
                name: 'Total Revenue',
                value: `${totalRevenue.toLocaleString()} MAD`,
                icon: 'TrendingUp',
                color: 'from-emerald-600/20 to-emerald-600/5',
                iconColor: 'text-emerald-500',
                trend: 'Lifetime'
            },
            {
                name: 'Total Orders',
                value: totalOrders.toLocaleString(),
                icon: 'ShoppingCart',
                color: 'from-orange-600/20 to-orange-600/5',
                iconColor: 'text-orange-500',
                trend: 'Confirmed'
            },
        ];

        return NextResponse.json({
            stats,
            recentActivity: recentActivity.map(order => ({
                id: order._id,
                user: order.userId?.name || 'Guest',
                amount: `${order.totalAmount} MAD`,
                time: order.createdAt,
                status: order.status
            }))
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
