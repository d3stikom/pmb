"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, Mail, Search, LogOut, User, Settings, X } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import Breadcrumbs from "./Breadcrumbs";

export default function Header() {
    const { isSidebarOpen, toggleSidebar, isMobile } = useSidebar();
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userName = localStorage.getItem('name') || 'User';
        const userEmail = localStorage.getItem('email');
        setUser({ name: userName, email: userEmail });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    const initials = user?.name
        ?.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase() || 'U';

    return (
        <header className={cn(
            "h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 right-0 z-40 flex items-center px-4 justify-between transition-all duration-300",
            isSidebarOpen && !isMobile ? "left-64" : "left-0 md:left-20"
        )}>
            {/* Left items */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="text-[#052c65] hover:bg-slate-100 p-2 rounded-lg transition-colors"
                >
                    {isSidebarOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div className="hidden sm:block">
                    <Breadcrumbs />
                </div>
            </div>

            {/* Right items */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-3 pr-8 py-1.5 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none w-48 transition-all"
                    />
                    <Search size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Icons */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-px bg-gray-200 mx-1"></div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="w-8 h-8 bg-[#052c65] rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {initials}
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 hidden group-hover:block transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <User size={16} /> Profile
                            </a>
                            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Settings size={16} /> Settings
                            </a>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
