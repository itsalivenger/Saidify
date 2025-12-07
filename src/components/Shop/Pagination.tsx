import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination() {
    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3, 4, 5].map((page, i) => (
                <button
                    key={page}
                    className={cn(
                        "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                        i === 0
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                    )}
                >
                    {page}
                </button>
            ))}

            <span className="text-muted-foreground px-2">...</span>

            <button className="w-10 h-10 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                12
            </button>

            <button className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
