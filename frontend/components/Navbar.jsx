"use client";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isScrolled
                ? "bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm py-2"
                : "bg-white py-4 shadow-md"
        )}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                        <span className="text-2xl font-bold text-[#052c65] transition-colors">
                            PMB <span className="text-[#ffc107]">STIKOM</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="transition-colors font-medium hover:text-[#ffc107] text-slate-600">Beranda</Link>
                        <Link href="/paths" className="transition-colors font-medium hover:text-[#ffc107] text-slate-600">Jalur Pendaftaran</Link>
                        <Link href="/programs" className="transition-colors font-medium hover:text-[#ffc107] text-slate-600">Program Studi</Link>
                        <Link href="/login">
                            <Button variant="ghost" className="text-[#052c65] hover:text-[#ffc107] hover:bg-slate-50">Masuk</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-[#ffc107] hover:bg-[#e6ae06] text-[#052c65] font-bold shadow-md h-10 px-6 rounded-lg transition-all active:scale-95">
                                Daftar Sekarang
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-[#052c65] hover:text-[#ffc107]"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 bg-white space-y-4 animate-in slide-in-from-top duration-300 rounded-b-2xl shadow-xl">
                        <Link href="/" className="block font-medium px-4 text-slate-600 hover:text-[#ffc107]">Beranda</Link>
                        <Link href="/paths" className="block font-medium px-4 text-slate-600 hover:text-[#ffc107]">Jalur Pendaftaran</Link>
                        <Link href="/programs" className="block font-medium px-4 text-slate-600 hover:text-[#ffc107]">Program Studi</Link>
                        <div className="flex flex-col space-y-2 pt-4 px-4">
                            <Link href="/login">
                                <Button variant="ghost" className="w-full justify-start text-[#052c65] hover:text-[#ffc107] hover:bg-slate-50">Masuk</Button>
                            </Link>
                            <Link href="/register">
                                <Button className="w-full bg-[#ffc107] hover:bg-[#e6ae06] text-[#052c65] font-bold shadow-md">
                                    Daftar Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
