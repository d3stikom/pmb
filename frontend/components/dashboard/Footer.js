import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

export default function Footer() {
    const { isSidebarOpen, isMobile } = useSidebar();

    return (
        <footer className={cn(
            "h-14 bg-white border-t border-gray-200 fixed bottom-0 right-0 z-30 flex items-center justify-between px-6 text-sm text-gray-500 transition-all duration-300",
            isSidebarOpen && !isMobile ? "left-64" : "left-0 md:left-20"
        )}>
            <div>
                <strong>Copyright &copy; {new Date().getFullYear()} <a href="#" className="text-blue-600 hover:underline">PMB STIKOM PGRI Banyuwangi</a>.</strong> All rights reserved.
            </div>
            <div className="hidden md:block">
                <b>Version</b> 3.2.0
            </div>
        </footer>
    );
}
