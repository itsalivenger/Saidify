'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    if (isAdmin) {
        // No navbar, no footer, no padding for admin
        return <>{children}</>;
    }

    return (
        <div className="pt-24">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
