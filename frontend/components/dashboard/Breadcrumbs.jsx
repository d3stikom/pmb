"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeConfig = {
    dashboard: "Dashboard",
    apply: "Pendaftaran",
    master: "Master Data",
    paths: "Jalur Pendaftaran",
    programs: "Program Studi",
    users: "Manajemen User",
    applicants: "Data Pendaftar",
    'all-applications': "Semua Pendaftaran",
};

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-400">
            <Link
                href="/dashboard"
                className="hover:text-[#052c65] flex items-center gap-1 transition-colors"
            >
                <Home size={14} />
            </Link>

            {segments.map((segment, index) => {
                const path = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const label = routeConfig[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

                if (segment === "dashboard" && index === 0) return null;

                return (
                    <div key={path} className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-gray-300" />
                        {isLast ? (
                            <span className="text-[#052c65] font-bold truncate max-w-[100px] md:max-w-none">
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={path}
                                className="hover:text-[#052c65] transition-colors whitespace-nowrap"
                            >
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
