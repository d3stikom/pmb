"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import {
    Search,
    BookOpen,
    ChevronRight,
    Loader2,
    Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PublicPathsPage() {
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPaths = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/master/paths`);
                setPaths(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching paths:', err);
                setLoading(false);
            }
        };
        fetchPaths();
    }, []);

    const filteredPaths = paths.filter(path =>
        path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (path.description && path.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* Header Section */}
            <section className="bg-[#052c65] py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://stikombanyuwangi.ac.id/assets/img/hero-bg.jpg')] bg-cover bg-center" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Jalur Pendaftaran</h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        Pilih jalur pendaftaran yang sesuai dengan kualifikasi dan prestasi Anda untuk bergabung dengan Stikom Banyuwangi.
                    </p>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full text-[#052c65]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            placeholder="Cari jalur pendaftaran (misal: Reguler, Prestasi...)"
                            className="pl-12 h-14 text-lg border-gray-100 focus:ring-[#052c65] rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Paths Grid */}
            <main className="container mx-auto px-4 py-16 flex-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-[#ffc107] animate-spin mb-4" />
                        <p className="text-[#052c65] font-medium text-lg">Memuat informasi jalur...</p>
                    </div>
                ) : filteredPaths.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Info className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#052c65] mb-2">Jalur Tidak Ditemukan</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Kami tidak dapat menemukan jalur pendaftaran dengan kata kunci "{searchQuery}".</p>
                        <Button variant="link" onClick={() => setSearchQuery('')} className="mt-4 text-[#052c65] font-bold">
                            Hapus Pencarian
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {filteredPaths.map((path) => (
                            <Card key={path.id} className="hover:shadow-2xl transition-all duration-300 border-none shadow-lg group overflow-hidden flex flex-col">
                                <div className="h-2 bg-[#ffc107] w-full" />
                                <CardHeader className="pb-4">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#052c65] group-hover:scale-110 transition-transform">
                                        <BookOpen size={32} />
                                    </div>
                                    <div className="flex flex-col gap-1 mb-2">
                                        <CardTitle className="text-2xl font-bold text-[#052c65] group-hover:text-[#ffc107] transition-colors">
                                            {path.name}
                                        </CardTitle>
                                        {(path.startDate && path.endDate) && (
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <Calendar size={14} className="text-[#ffc107]" />
                                                {new Date(path.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(path.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        )}
                                    </div>
                                    <CardDescription className="text-md leading-relaxed min-h-[4rem]">
                                        {path.pathDescription || path.description || 'Informasi pendaftaran melalui jalur ini.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 mt-auto">
                                    <div className="h-px bg-gray-100 w-full mb-6" />
                                    <div className="flex items-center justify-between gap-4">
                                        <Link href={`/paths/${path.id}`}>
                                            <Button variant="link" className="text-[#052c65] font-bold p-0 flex items-center gap-2 hover:text-[#ffc107] transition-all">
                                                Selengkapnya
                                            </Button>
                                        </Link>
                                        <Link href="/register" className="flex-1">
                                            <Button className="w-full h-12 bg-[#052c65] hover:bg-[#042452] text-white font-bold rounded-xl flex items-center justify-center gap-2 group/btn">
                                                Daftar
                                                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* CTA Section */}
            {!loading && filteredPaths.length > 0 && (
                <section className="bg-white border-t border-gray-100 py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-[#052c65] mb-4">Masih Bingung Memilih Jalur?</h2>
                        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                            Konsultasikan rencana studi Anda dengan tim pendaftaran kami melalui layanan WhatsApp atau datang langsung ke kampus.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="outline" className="border-[#052c65] text-[#052c65] font-bold h-12 px-8 rounded-xl shadow-sm">
                                Hubungi WhatsApp
                            </Button>
                            <Button className="bg-[#ffc107] hover:bg-[#e6ae06] text-[#052c65] font-bold h-12 px-8 rounded-xl shadow-md">
                                Layanan Informasi
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Reusing Dashboard Style Footer for simplicity/consistency */}
            <footer className="bg-[#052c65] text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-gray-300">
                        &copy; {new Date().getFullYear()} <span className="text-white font-bold">STIKOM PGRI BANYUWANGI</span>. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
