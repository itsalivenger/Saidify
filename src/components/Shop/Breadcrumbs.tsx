import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs() {
    return (
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground font-medium">Shop</span>
        </nav>
    );
}
