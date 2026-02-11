"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, ChevronLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function VerifySearchPage() {
    const [searchId, setSearchId] = useState('');
    const router = useRouter();

    const handleCheck = (e) => {
        if (e) e.preventDefault();
        const id = searchId.trim();
        if (!id) return;

        console.log('Navigating to verify ID:', id);
        router.push(`/verify/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-[#052c65] font-bold hover:gap-2 transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
                    </Link>
                </div>

                <div className="bg-[#052c65] rounded-3xl shadow-2xl overflow-hidden relative border border-blue-900/20">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />

                    <div className="p-10 md:p-14 relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-[#ffc107] mb-8 border border-white/20 backdrop-blur-md">
                                <ShieldCheck size={40} />
                            </div>

                            <h1 className="text-3xl font-black text-white mb-4 leading-tight">Validasi Pendaftaran</h1>
                            <p className="text-blue-200 text-sm mb-10 font-medium leading-relaxed">
                                Masukkan ID Pendaftaran Anda di bawah ini untuk memverifikasi keaslian status pendaftaran mahasiswa baru.
                            </p>

                            <form onSubmit={handleCheck} className="w-full space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-300 group-focus-within:text-[#ffc107] transition-colors">
                                        <Search size={22} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Contoh: 123456"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="w-full bg-white/10 border-2 border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-xl placeholder:text-blue-300/30 font-black focus:outline-none focus:ring-4 focus:ring-[#ffc107]/20 focus:border-[#ffc107] transition-all"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleCheck}
                                    className="w-full bg-[#ffc107] hover:bg-[#e6ae06] text-[#052c65] font-black py-8 rounded-2xl text-lg shadow-xl shadow-[#ffc107]/20 uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Cek Sekarang
                                </Button>
                            </form>

                            <div className="mt-12 flex items-center gap-4 text-blue-300/50">
                                <div className="h-px flex-1 bg-white/10" />
                                <GraduationCap size={20} />
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <p className="mt-8 text-[10px] font-black text-blue-300/40 uppercase tracking-[0.3em]">
                                Official Verification Portal <br /> PMB Stikom Banyuwangi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
