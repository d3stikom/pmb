"use client";

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { ShieldCheck, XCircle, Loader2, ChevronLeft, CheckCircle2, AlertCircle, Calendar, GraduationCap, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function VerificationPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyId = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/pmb/verify/${id}`);
                setResult(response.data.data);
            } catch (err) {
                console.error('Verification error:', err);
                setError(err.response?.data?.message || 'Gagal memverifikasi ID Pendaftaran.');
            } finally {
                setLoading(false);
            }
        };

        if (id) verifyId();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-[#052c65] animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Memverifikasi Data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-[#052c65] font-bold hover:gap-2 transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
                    </Link>
                </div>

                {error ? (
                    <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-red-100 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="text-red-500" size={48} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 mb-2">Validasi Gagal</h1>
                        <p className="text-slate-500 font-medium mb-8">{error}</p>
                        <Link href="/">
                            <Button className="bg-[#052c65] hover:bg-[#042452] text-white px-8 rounded-xl font-bold">Coba ID Lain</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative">
                        {/* Status Banner */}
                        <div className={`py-6 px-10 flex items-center justify-between text-white ${result.status === 'VERIFIED' ? 'bg-green-600' :
                                result.status === 'REJECTED' ? 'bg-red-600' : 'bg-[#052c65]'
                            }`}>
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={28} />
                                <span className="font-black uppercase tracking-widest">Data Valid</span>
                            </div>
                            <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                                {result.status}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-10 space-y-8">
                            <div className="text-center pb-8 border-b border-slate-50">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">ID PENDAFTARAN</div>
                                <h2 className="text-4xl font-black text-[#052c65]">#{String(result.id).padStart(6, '0')}</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#052c65] shrink-0">
                                        <UserIcon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama Pendaftar</div>
                                        <p className="text-xl font-bold text-slate-800">{result.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Program Studi</div>
                                        <p className="text-lg font-bold text-slate-800">{result.program}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jalur Masuk</div>
                                        <p className="text-lg font-bold text-slate-800 uppercase italic leading-tight">{result.registrationPath}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Badge */}
                            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                                <div className="inline-flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">
                                    <CheckCircle2 size={14} /> Terverifikasi Oleh Sistem PMB
                                </div>
                                <p className="text-[9px] text-slate-400 font-medium">
                                    Data sinkronisasi terakhir: {new Date(result.verifiedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        Official Verification System Stikom Banyuwangi
                    </p>
                </div>
            </div>
        </div>
    );
}
