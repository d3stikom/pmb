"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, GraduationCap, Award, BookOpen, Clock, Briefcase, CheckCircle2, ChevronRight, Loader2, Info } from 'lucide-react';

export default function ProgramDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/master/programs/${params.id}`);
                setProgram(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching program:', err);
                setError('Program studi tidak ditemukan.');
                setLoading(false);
            }
        };
        if (params.id) fetchProgram();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-[#ffc107] animate-spin" />
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Info size={48} className="text-gray-400" />
                <h1 className="text-2xl font-bold text-[#052c65]">{error}</h1>
                <Button onClick={() => router.push('/programs')} variant="outline">Kembali ke Daftar Prodi</Button>
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
                        <div className="flex gap-2 mb-4">
                            <span className="px-3 py-1 bg-[#ffc107] text-[#052c65] text-xs font-bold rounded-full shadow-sm">
                                {program.degree}
                            </span>
                            <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                                Kode: {program.code}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            {program.name}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
                            Membangun kompetensi profesional di bidang teknologi informasi dan komunikasi dengan standar global dan inovasi tanpa batas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-[#052c65] rounded-xl flex items-center justify-center shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Durasi Studi</p>
                                    <p className="text-lg font-bold text-[#052c65]">{program.degree === 'S1' ? '8 Semester' : '6 Semester'}</p>
                                </div>
                            </Card>
                            <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-50 text-[#ffc107] rounded-xl flex items-center justify-center shrink-0">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Gelar Lulusan</p>
                                    <p className="text-lg font-bold text-[#052c65]">{program.degree === 'S1' ? 'S.Kom' : 'A.Md.Kom'}</p>
                                </div>
                            </Card>
                        </div>

                        {/* Description */}
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="bg-slate-50 border-b border-gray-100 p-8">
                                <CardTitle className="text-[#052c65] flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-[#052c65]">
                                        <BookOpen size={20} />
                                    </div>
                                    Visi & Profil Progam Studi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-[#052c65] mb-4">Tentang Program</h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        Program Studi {program.name} di STIKOM PGRI Banyuwangi berfokus pada pengembangan keahlian {program.name.includes('Informasi') ? 'manajemen dan integrasi sistem' : 'rekayasa perangkat lunak dan infrastruktur digital'}. Mahasiswa akan dibekali dengan kurikulum yang relevan dengan kebutuhan industri saat ini.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        Dengan fasilitas laboratorium modern dan dosen praktisi berpengalaman, lulusan dipersiapkan untuk menjadi pemimpin di era transformasi digital.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-[#052c65] mb-4 text-blue-900">Materi Unggulan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            'Web & Mobile Development',
                                            'Database Management',
                                            'Network Security',
                                            'Artificial Intelligence',
                                            'User Experience (UX) Design',
                                            'Project Management'
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <CheckCircle2 size={16} className="text-green-500" />
                                                <span className="text-sm font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Career Prospects */}
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="bg-slate-50 border-b border-gray-100 p-8">
                                <CardTitle className="text-[#052c65] flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg text-[#ffc107]">
                                        <Briefcase size={20} />
                                    </div>
                                    Prospek Karir
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ul className="space-y-4">
                                    {[
                                        'Software Engineer / Programmer',
                                        'System Analyst',
                                        'IT Consultant',
                                        'Database Administrator',
                                        'UI/UX Designer',
                                        'Digital Entrepreneur'
                                    ].map((job, i) => (
                                        <li key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                                            <span className="text-slate-700 font-medium">{job}</span>
                                            <ChevronRight size={18} className="text-slate-300 group-hover:text-[#ffc107] transition-colors" />
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: CTA & Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden sticky top-28 bg-white">
                            <div className="h-3 bg-[#ffc107]" />
                            <CardHeader className="text-center p-8">
                                <CardTitle className="text-2xl text-[#052c65]">Siap Bergabung?</CardTitle>
                                <CardDescription>Wujudkan impianmu menjadi tenaga ahli IT handal bersama kami.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 flex flex-col gap-4">
                                <Link href="/register">
                                    <Button className="w-full bg-[#052c65] hover:bg-[#042452] text-white font-bold h-14 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-98">
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                                <Link href="/paths">
                                    <Button variant="outline" className="w-full border-slate-200 h-14 rounded-2xl flex items-center gap-2 font-bold text-slate-700">
                                        Lihat Jalur Masuk
                                    </Button>
                                </Link>

                                <div className="mt-6 p-6 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-xl shadow-sm text-[#ffc107]">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#052c65] mb-1">Beasiswa Tersedia</p>
                                        <p className="text-[10px] text-slate-600 leading-relaxed">
                                            Dapatkan potongan biaya kuliah hingga 100% melalui Jalur Prestasi atau KIP-Kuliah.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
}
