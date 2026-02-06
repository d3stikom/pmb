"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    User,
    Users,
    ClipboardList,
    Database,
    ChevronLeft,
    Menu
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const { isSidebarOpen, setIsSidebarOpen, isMobile, toggleSidebar } = useSidebar();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const role = user?.role || 'PENDAFTAR';

    const isActive = (path) => pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={cn(
                "bg-[#052c65] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-[#042452] shadow-xl z-50 transition-all duration-300 ease-in-out",
                isMobile
                    ? (isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full")
                    : (isSidebarOpen ? "w-64" : "w-20")
            )}>
                {/* Brand Logo */}
                <div className="h-14 flex items-center px-4 border-b border-[#042452] bg-[#052c65] justify-between">
                    <span className={cn(
                        "font-bold tracking-wider text-white transition-all duration-300 overflow-hidden whitespace-nowrap",
                        isSidebarOpen ? "text-xl w-auto opacity-100" : "text-[10px] w-0 opacity-0"
                    )}>
                        PMB <span className="text-[#ffc107]">STIKOM</span>
                    </span>
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded-lg hover:bg-[#042452] transition-colors text-gray-400 hover:text-white"
                        >
                            <Menu size={20} />
                        </button>
                    )}
                </div>

                {/* User Panel */}
                <div className={cn(
                    "p-4 border-b border-[#042452] transition-all duration-300",
                    !isSidebarOpen && !isMobile && "px-2"
                )}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#042452] flex-shrink-0 flex items-center justify-center border-2 border-[#1a4a8d]">
                            <User className="w-6 h-6 text-gray-300" />
                        </div>
                        {isSidebarOpen && (
                            <div className="animate-in fade-in duration-500 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate max-w-[140px]">{user?.name || 'User'}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-[#ffc107] animate-pulse"></span>
                                    <span className="text-xs text-gray-300 uppercase tracking-tighter">{role}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                    <ul className="space-y-1 px-2">
                        {isSidebarOpen && (
                            <li className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 animate-in fade-in">
                                Main Navigation
                            </li>
                        )}

                        <NavItem
                            href="/dashboard"
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                            active={isActive('/dashboard')}
                            collapsed={!isSidebarOpen && !isMobile}
                        />

                        {/* PENDAFTAR MENUS */}
                        {role === 'PENDAFTAR' && (
                            <NavItem
                                href="/dashboard/apply"
                                icon={<FileText size={20} />}
                                label="Pendaftaran"
                                active={isActive('/dashboard/apply')}
                                badge="NEW"
                                collapsed={!isSidebarOpen && !isMobile}
                            />
                        )}

                        {/* PRODI MENUS */}
                        {role === 'PRODI' && (
                            <NavItem
                                href="/dashboard/applicants"
                                icon={<ClipboardList size={20} />}
                                label="Data Pendaftar"
                                active={isActive('/dashboard/applicants')}
                                collapsed={!isSidebarOpen && !isMobile}
                            />
                        )}

                        {/* ADMIN MENUS */}
                        {role === 'ADMIN' && (
                            <>
                                <NavItem
                                    href="/dashboard/all-applications"
                                    icon={<ClipboardList size={20} />}
                                    label="Semua Pendaftaran"
                                    active={isActive('/dashboard/all-applications')}
                                    collapsed={!isSidebarOpen && !isMobile}
                                />
                                {isSidebarOpen && (
                                    <li className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 animate-in fade-in">
                                        Data Master
                                    </li>
                                )}
                                <NavItem
                                    href="/dashboard/master/paths"
                                    icon={<FileText size={20} />}
                                    label="Jalur Pendaftaran"
                                    active={isActive('/dashboard/master/paths')}
                                    collapsed={!isSidebarOpen && !isMobile}
                                />
                                <NavItem
                                    href="/dashboard/master/programs"
                                    icon={<Database size={20} />}
                                    label="Program Studi"
                                    active={isActive('/dashboard/master/programs')}
                                    collapsed={!isSidebarOpen && !isMobile}
                                />
                                <NavItem
                                    href="/dashboard/users"
                                    icon={<Users size={20} />}
                                    label="Manajemen User"
                                    active={isActive('/dashboard/users')}
                                    collapsed={!isSidebarOpen && !isMobile}
                                />
                            </>
                        )}
                    </ul>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-[#042452]">
                    <NavItem
                        href="/dashboard/settings"
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={isActive('/dashboard/settings')}
                        collapsed={!isSidebarOpen && !isMobile}
                    />
                </div>
            </aside>
        </>
    );
}

function NavItem({ href, icon, label, active, badge, collapsed }) {
    return (
        <li>
            <Link
                href={href}
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    active
                        ? "bg-[#ffc107] text-[#052c65] shadow-lg font-bold"
                        : "text-gray-200 hover:bg-[#042452] hover:text-white"
                )}
            >
                <div className={cn(
                    "transition-transform duration-300",
                    active ? "scale-110" : "group-hover:scale-110"
                )}>
                    {icon}
                </div>

                {!collapsed && (
                    <span className="font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                        {label}
                    </span>
                )}

                {badge && !collapsed && (
                    <span className="ml-auto bg-[#ffc107] text-[#052c65] text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {badge}
                    </span>
                )}

                {collapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-[#052c65] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-[#042452] z-[60]">
                        {label}
                    </div>
                )}
            </Link>
        </li>
    );
}
