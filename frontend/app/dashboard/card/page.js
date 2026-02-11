"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Printer, ChevronLeft, MapPin, Phone, Mail, Globe, ShieldCheck, GraduationCap, Calendar, User as UserIcon, BookOpen } from 'lucide-react';
import axios from 'axios';

export default function RegistrationCardPage() {
    const router = useRouter();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/pmb/my-application`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.application && response.data.application.status === 'VERIFIED') {
                    setApplication(response.data.application);
                } else {
                    alert('Hanya pendaftar yang sudah TERVERIFIKASI yang dapat melihat kartu ini.');
                    router.push('/dashboard');
                }
            } catch (err) {
                console.error('Error fetching application for card:', err);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [router]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!application) return null;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 print:bg-white print:p-0">
            {/* Action Bar - Hidden on Print */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#052c65] font-bold transition-colors"
                >
                    <ChevronLeft size={20} /> Kembali ke Dashboard
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-[#052c65] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#042452] transition-all shadow-lg shadow-blue-900/20"
                >
                    <Printer size={20} /> Cetak Kartu
                </button>
            </div>

            {/* The Card Container */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 print:shadow-none print:border-2 print:border-gray-200">
                    {/* Header Banner */}
                    <div className="bg-[#052c65] p-8 text-white relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                            <ShieldCheck size={300} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <GraduationCap size={40} className="text-[#ffc107]" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight leading-tight uppercase">Kartu Peserta PMB</h1>
                                    <p className="text-blue-200 text-sm font-bold tracking-widest uppercase">Stikom PGRI Banyuwangi • TA 2024/2025</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-1">ID Pendaftaran</span>
                                <span className="text-2xl font-black text-[#ffc107]">#{String(application.id).padStart(6, '0')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-10 flex flex-col md:flex-row gap-10">
                        {/* Photo Placeholder */}
                        <div className="flex flex-col items-center gap-4 shrink-0">
                            <div className="w-48 h-64 bg-slate-50 border-4 border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                                <UserIcon size={100} className="text-slate-200" />
                            </div>
                            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full font-black text-[10px] uppercase border border-green-100">
                                Status: Terverifikasi
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</span>
                                    <p className="text-xl font-bold text-slate-800">{application.User?.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIK / No. Identitas</span>
                                    <p className="text-xl font-bold text-slate-800">{application.nik || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jalur Pendaftaran</span>
                                    <p className="text-lg font-bold text-[#052c65] uppercase italic">{application.RegistrationPath?.name || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Program Studi</span>
                                    <p className="text-lg font-bold text-slate-800">{application.Program1?.name || '-'}</p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-500">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tgl Daftar</span>
                                        <p className="text-sm font-bold text-slate-700">{new Date(application.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-amber-500">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Lokasi Kampus</span>
                                        <p className="text-sm font-bold text-slate-700">STIKOM PGRI Banyuwangi</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Instructions */}
                    <div className="bg-slate-50 border-t border-slate-100 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Petunjuk Peserta:</h4>
                                <ul className="text-[10px] text-slate-500 space-y-2 list-decimal pl-4 font-medium leading-relaxed">
                                    <li>Bawa kartu ini saat mengikuti ujian masuk/registrasi ulang.</li>
                                    <li>Pastikan data di atas sudah sesuai dengan identitas asli Anda.</li>
                                    <li>Kartu ini sah selama status pendaftaran Anda adalah VERIFIED.</li>
                                    <li>Ikuti informasi terbaru melalui portal pendaftaran atau WhatsApp resmi.</li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-center md:items-end">
                                <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                                    <div className="text-[10px] font-black text-slate-300 uppercase text-center">QR CODE<br />VALIDASI</div>
                                </div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Dokumen ini diterbitkan secara elektronik oleh Sistem PMB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Footer Support */}
                <div className="mt-8 text-center text-[10px] text-gray-400 hidden print:block border-t border-dashed border-gray-300 pt-4 uppercase font-bold tracking-[0.2em]">
                    www.stikombanyuwangi.ac.id • Kampus Teknologi Pilihan Utama
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
