'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingCart,
    Globe,
    LogOut,
    ChevronDown,
    Menu,
    Settings,
    Users,
    Palette,
    Package,
    Mail
} from 'lucide-react';
import Link from 'next/link';

interface AdminUser {
    name: string;
    email: string;
    role?: string;
}

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(pathname.includes('/products'));
    const [isOrdersOpen, setIsOrdersOpen] = useState(pathname.includes('/orders'));
    const [isSettingsOpen, setIsSettingsOpen] = useState(pathname.includes('/settings'));
    const [isDesignerOpen, setIsDesignerOpen] = useState(pathname.includes('/blanks'));
    const [isWebsiteOpen, setIsWebsiteOpen] = useState(pathname.includes('/website') || pathname.includes('/about'));
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        const userStr = localStorage.getItem('adminUser');
        if (userStr) {
            try {
                setAdminUser(JSON.parse(userStr));
            } catch {
                setAdminUser(null);
            }
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        {
            name: 'Products',
            icon: ShoppingCart,
            isDropdown: true,
            stateKey: 'products',
            options: [
                { name: 'Add Product', path: '/admin/dashboard/products/1' },
                { name: 'Inventory Control', path: '/admin/dashboard/products/master' },
                { name: 'Categories', path: '/admin/dashboard/products/categories' },
            ]
        },
        {
            name: 'Orders',
            icon: Package,
            isDropdown: true,
            stateKey: 'orders',
            options: [
                { name: 'Regular Orders', path: '/admin/dashboard/orders/regular' },
                { name: 'Custom Orders', path: '/admin/dashboard/orders/custom' },
            ]
        },
        { name: 'Clients', icon: Users, path: '/admin/dashboard/clients' },
        {
            name: 'Custom Designer',
            icon: Palette,
            isDropdown: true,
            stateKey: 'designer',
            options: [
                { name: 'Blank Products', path: '/admin/dashboard/blanks' },
                { name: 'Add Blank Product', path: '/admin/dashboard/blanks/new' },
            ]
        },
        { name: 'Newsletter', icon: Mail, path: '/admin/dashboard/newsletter' },
        { name: 'Website Control', icon: Settings, path: '/admin/dashboard/settings/website' },
    ];

    const sidebarVariants = {
        expanded: { x: 0, width: '280px' },
        collapsed: { x: -280, width: '0px' }
    };

    const SideNavItem = ({ item }: { item: any }) => {
        const isActive = pathname === item.path;
        const hasActiveChild = item.options?.some((opt: any) => pathname === opt.path);

        if (item.isDropdown) {
            const getIsOpen = () => {
                switch (item.stateKey) {
                    case 'products': return isProductsOpen;
                    case 'orders': return isOrdersOpen;
                    case 'designer': return isDesignerOpen;
                    case 'website': return isWebsiteOpen;
                    case 'settings': return isSettingsOpen;
                    default: return false;
                }
            };

            const getToggle = () => {
                switch (item.stateKey) {
                    case 'products': return () => setIsProductsOpen(!isProductsOpen);
                    case 'orders': return () => setIsOrdersOpen(!isOrdersOpen);
                    case 'designer': return () => setIsDesignerOpen(!isDesignerOpen);
                    case 'website': return () => setIsWebsiteOpen(!isWebsiteOpen);
                    case 'settings': return () => setIsSettingsOpen(!isSettingsOpen);
                    default: return () => { };
                }
            };

            const isOpen = getIsOpen();
            const toggleOpen = getToggle();
            return (
                <div className="px-3 py-1">
                    <button
                        onClick={toggleOpen}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${isOpen || hasActiveChild
                            ? 'bg-purple-600/10 text-white border border-purple-500/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={`w-6 h-6 ${(isOpen || hasActiveChild) ? 'text-purple-500' : 'group-hover:text-purple-400'} transition-colors`} />
                            <span className="font-medium whitespace-nowrap">{item.name}</span>
                        </div>
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-1 ml-4 border-l border-white/10"
                            >
                                {item.options.map((opt: any) => {
                                    const isSubActive = pathname === opt.path;
                                    return (
                                        <Link
                                            key={opt.name}
                                            href={opt.path}
                                            className={`block p-3 pl-8 text-sm transition-all rounded-r-xl ${isSubActive
                                                ? 'text-purple-400 bg-purple-500/5 font-bold'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {opt.name}
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        return (
            <div className="px-3 py-1">
                <Link
                    href={item.path}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${isActive
                        ? 'bg-purple-600/20 text-white border border-purple-500/20 shadow-[0_0_20px_rgba(147,51,234,0.1)]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <item.icon className={`w-6 h-6 ${isActive ? 'text-purple-500' : 'group-hover:text-purple-400'} transition-colors`} />
                    <span className="font-medium whitespace-nowrap">{item.name}</span>
                    {isActive && (
                        <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    )}
                </Link>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={isSidebarCollapsed ? 'collapsed' : 'expanded'}
                variants={sidebarVariants}
                className="fixed lg:relative flex flex-col border-r border-white/10 bg-[#0f0f0f] z-40 transition-all shadow-2xl h-full"
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3 group" title="Back to website">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:scale-105 transition-transform">
                            <Globe className="text-white w-6 h-6" />
                        </div>
                        <motion.span
                            className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-blue-400 transition-all"
                        >
                            ADM.SAID
                        </motion.span>
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <SideNavItem key={item.name} item={item} />
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-3 border-t border-white/5 space-y-1">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Content Area */}
            <main className="flex-1 flex flex-col h-screen relative w-full overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 flex items-center justify-between px-8 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/10 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-gray-400 font-medium hidden sm:block">
                            {pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 py-1.5 px-3 rounded-full bg-white/5 border border-white/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                {adminUser?.name?.[0] || 'A'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium leading-none">{adminUser?.name || 'Admin'}</p>
                                <p className="text-[10px] text-gray-500 mt-1">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <section className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </section>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
