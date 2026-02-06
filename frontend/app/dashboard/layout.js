"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

function DashboardContent({ children }) {
    const { isSidebarOpen, isMobile } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
            <Sidebar />
            <Header />

            <main className={cn(
                "pt-14 pb-14 min-h-screen transition-all duration-300",
                isSidebarOpen && !isMobile ? "ml-64" : "ml-0 md:ml-20"
            )}>
                <div className="p-6">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </SidebarProvider>
    );
}
