"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, Info, CheckCircle2, Calendar, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function PathDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [path, setPath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPath = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/master/paths/${params.id}`);
                setPath(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching path:', err);
                setError('Jalur pendaftaran tidak ditemukan.');
                setLoading(false);
            }
        };
        if (params.id) fetchPath();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-[#ffc107] animate-spin" />
            </div>
        );
    }

    if (error || !path) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Info size={48} className="text-gray-400" />
                <h1 className="text-2xl font-bold text-[#052c65]">{error}</h1>
                <Button onClick={() => router.push('/paths')} variant="outline">Kembali ke Daftar Jalur</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* Header Section */}
            <section className="bg-[#052c65] text-white py-16 pt-28 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://stikombanyuwangi.ac.id/assets/img/hero-bg.jpg')] bg-cover bg-center" />
                <div className="container mx-auto px-4 relative z-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Kembali
                    </button>
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <div className="px-4 py-1.5 bg-[#ffc107] text-[#052c65] text-xs font-bold rounded-full shadow-sm">
                                Jalur Pendaftaran
                            </div>
                            {(path.startDate && path.endDate) && (
                                <div className="px-4 py-1.5 bg-white/10 text-white text-xs font-bold rounded-full backdrop-blur-sm flex items-center gap-2">
                                    <Calendar size={14} className="text-[#ffc107]" />
                                    {new Date(path.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(path.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            {path.name}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
                            {path.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="bg-slate-50 border-b border-gray-100 p-8">
                                <CardTitle className="text-[#052c65] flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-[#052c65]">
                                        <FileText size={20} />
                                    </div>
                                    Detail Jalur Pendaftaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-[#052c65] mb-4">Mengenai Jalur Ini</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg italic mb-6">
                                        "{path.description}"
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        {path.pathDescription || 'STIKOM PGRI Banyuwangi memberikan kesempatan bagi calon mahasiswa untuk bergabung melalui jalur ini dengan berbagai kemudahan dan manfaat yang ditawarkan sesuai dengan visi mencetak generasi unggul di bidang teknologi.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3 text-[#052c65] font-bold">
                                            <Calendar size={20} className="text-[#ffc107]" />
                                            Periode Pendaftaran
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            {path.startDate && path.endDate ? (
                                                <>Mulai {new Date(path.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} s/d {new Date(path.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</>
                                            ) : (
                                                'Terbuka selama Gelombang 1, 2, dan 3 PMB 2026.'
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3 text-[#052c65] font-bold">
                                            <CheckCircle2 size={20} className="text-[#ffc107]" />
                                            Metode Seleksi
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            {path.name === 'PRESTASI' ? 'Seleksi Berkas Prestasi & Wawancara' : 'Tes Tulis Potensi Akademik (TPA)'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-[#052c65] mb-4">Persyaratan Umum</h3>
                                    <ul className="space-y-4">
                                        {[
                                            'Warga Negara Indonesia (WNI)',
                                            'Lulusan SMA/SMK/MA sederajat',
                                            'Melampirkan scan Ijazah atau Surat Keterangan Lulus (SKL)',
                                            'Pas foto berwarna terbaru',
                                            'Mengisi formulir pendaftaran online'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-600">
                                                <div className="mt-1 flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 size={12} strokeWidth={3} />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: CTA & Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden sticky top-28 bg-white">
                            <div className="h-3 bg-[#ffc107]" />
                            <CardHeader className="text-center p-8">
                                <CardTitle className="text-2xl text-[#052c65]">Tertarik Jalur Ini?</CardTitle>
                                <CardDescription>Daftarkan diri Anda segera dan jadilah bagian dari Stikom Banyuwangi.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 flex flex-col gap-4">
                                <Link href={`/register?path=${path.name}`}>
                                    <Button className="w-full bg-[#052c65] hover:bg-[#042452] text-white font-bold h-14 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-98">
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                                <Link href="https://wa.me/6281234567890" target="_blank">
                                    <Button variant="outline" className="w-full border-slate-200 h-14 rounded-2xl flex items-center gap-2 font-bold text-slate-700">
                                        Tanya Admin (WA)
                                    </Button>
                                </Link>

                                <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-xs text-blue-800 text-center leading-relaxed">
                                        Butuh bantuan? Silakan hubungi bagian pendaftaran kami di nomor (0333) 417902 atau kunjungi kampus langsung.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
}
