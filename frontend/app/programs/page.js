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
    Info,
    GraduationCap,
    Clock,
    Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PublicProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/master/programs`);
                setPrograms(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching programs:', err);
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    const filteredPrograms = programs.filter(prog =>
        prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* Header Section */}
            <section className="bg-[#052c65] py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://stikombanyuwangi.ac.id/assets/img/hero-bg.jpg')] bg-cover bg-center" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Program Studi</h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        Pilih program studi masa depan Anda dengan kurikulum yang relevan dengan kebutuhan industri digital saat ini.
                    </p>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full text-[#052c65]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            placeholder="Cari program studi (misal: Informatika, Sistem Informasi...)"
                            className="pl-12 h-14 text-lg border-gray-100 focus:ring-[#052c65] rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <main className="container mx-auto px-4 py-16 flex-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-[#ffc107] animate-spin mb-4" />
                        <p className="text-[#052c65] font-medium text-lg">Memuat daftar program studi...</p>
                    </div>
                ) : filteredPrograms.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Info className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#052c65] mb-2">Program Studi Tidak Ditemukan</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Kami tidak dapat menemukan program studi dengan kata kunci "{searchQuery}".</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {filteredPrograms.map((prog) => (
                            <Card key={prog.id} className="hover:shadow-2xl transition-all duration-300 border-none shadow-lg group overflow-hidden flex flex-col bg-white">
                                <div className={`h-2 w-full ${prog.degree === 'S1' ? 'bg-[#ffc107]' : 'bg-[#052c65]'}`} />
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#052c65] group-hover:scale-110 transition-transform">
                                            <GraduationCap size={32} />
                                        </div>
                                        <span className={`px-4 py-1 rounded-full text-sm font-bold ${prog.degree === 'S1' ? 'bg-yellow-100 text-[#052c65]' : 'bg-blue-100 text-[#052c65]'
                                            }`}>
                                            {prog.degree}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-[#052c65] mb-2 group-hover:text-[#ffc107] transition-colors">
                                        {prog.name}
                                    </CardTitle>
                                    <CardDescription className="text-md font-mono text-gray-400">
                                        Kode Prodi: {prog.code}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2 flex-1 flex flex-col">
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Program studi {prog.name} fokus pada pengembangan kompetensi digital dan inovasi teknologi untuk mencetak lulusan siap kerja.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-slate-50 p-2 rounded-lg">
                                            <Clock size={16} className="text-[#ffc107]" />
                                            <span>{prog.degree === 'S1' ? '8 Semester' : '6 Semester'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-slate-50 p-2 rounded-lg">
                                            <Award size={16} className="text-[#ffc107]" />
                                            <span>Gelar {prog.degree === 'S1' ? 'S.Kom' : 'A.Md.Kom'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-between gap-4">
                                            <Link href={`/programs/${prog.id}`}>
                                                <Button variant="link" className="text-[#052c65] font-bold p-0 flex items-center gap-2 hover:text-[#ffc107] transition-all">
                                                    Selengkapnya
                                                </Button>
                                            </Link>
                                            <Link href="/register" className="flex-1">
                                                <Button className="w-full h-12 bg-[#052c65] hover:bg-[#042452] text-white font-bold rounded-xl flex items-center justify-center gap-2 group/btn shadow-md">
                                                    Daftar
                                                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Reusing common footer */}
            <footer className="bg-[#052c65] text-white py-12 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-gray-300">
                        &copy; {new Date().getFullYear()} <span className="text-white font-bold">STIKOM PGRI BANYUWANGI</span>. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
