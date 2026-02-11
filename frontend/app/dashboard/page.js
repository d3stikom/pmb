"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileText, CheckCircle, AlertCircle, TrendingUp, ShoppingBag, BarChart2, Clock, XCircle, BookOpen, Calendar, Eye, Download, Pencil } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export default function DashboardPage() {
    const router = useRouter();
    const [news, setNews] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [adminStats, setAdminStats] = useState(null);
    const [application, setApplication] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const fetchDashboardData = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            try {
                if (parsedUser.role === 'ADMIN') {
                    const res = await fetch(`${API_URL}/api/dashboard/stats`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setAdminStats(data);
                } else {
                    const res = await fetch(`${API_URL}/api/pmb/my-application`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setApplication(data.application);
                }

                // Fetch Public Info (News & Schedules)
                const [newsRes, schedulesRes] = await Promise.all([
                    fetch(`${API_URL}/api/info/news`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/api/info/schedules`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const newsData = await newsRes.json();
                const schedulesData = await schedulesRes.json();
                setNews(newsData);
                setSchedules(schedulesData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    const COLORS = {
        'DRAFT': '#94a3b8',
        'SUBMITTED': '#3b82f6',
        'VERIFIED': '#22c55e',
        'REJECTED': '#ef4444'
    };

    const chartData = adminStats?.statusDistribution?.map(item => ({
        name: item.status,
        value: parseInt(item.count),
        fill: COLORS[item.status] || '#8884d8'
    })) || [];

    return (
        <div className="pb-10">
            {/* Content Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                </div>
                <div className="text-sm text-gray-500">
                    <span className="text-blue-500">Home</span> / Dashboard
                </div>
            </div>

            {user?.role === 'ADMIN' ? (
                <>
                    {/* Info Boxes for Admin */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Box 1: Total Calon */}
                        <div className="bg-white rounded-lg shadow p-4 flex items-center relative overflow-hidden group border-b-4 border-blue-600">
                            <div className="p-3 rounded bg-blue-600 text-white mr-4 transition-colors">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase text-nowrap">Total Calon Pendaftar</p>
                                <h3 className="text-xl font-bold text-gray-800">{adminStats?.stats?.applicants || 0}</h3>
                            </div>
                        </div>

                        {/* Box 2: Total Prodi */}
                        <div className="bg-white rounded-lg shadow p-4 flex items-center relative overflow-hidden group border-b-4 border-green-500">
                            <div className="p-3 rounded bg-green-500 text-white mr-4 transition-colors">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase text-nowrap">Total Program Studi</p>
                                <h3 className="text-xl font-bold text-gray-800">{adminStats?.stats?.studyPrograms || 0}</h3>
                            </div>
                        </div>

                        {/* Box 3: Total Users */}
                        <div className="bg-white rounded-lg shadow p-4 flex items-center relative overflow-hidden group border-b-4 border-amber-500">
                            <div className="p-3 rounded bg-amber-500 text-white mr-4 transition-colors">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase text-nowrap">Total User Sistem</p>
                                <h3 className="text-xl font-bold text-gray-800">{adminStats?.stats?.users || 0}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white rounded-lg shadow border-t-4 border-[#052c65] mb-8">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                <BarChart2 size={18} />
                                Grafik Status Pendaftar
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            cursor={{ fill: '#f3f4f6' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Application Status for Regular User */
                <div className="bg-white rounded-lg border-t-4 border-[#052c65] shadow-lg mb-8">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                            <FileText size={18} />
                            Status Pendaftaran
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="bg-blue-50 border-l-4 border-[#052c65] p-4 mb-4 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-[#052c65]" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-800">
                                        Selamat datang di Dashboard PMB Stikom Banyuwangi!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!application ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada pendaftaran</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-6">Anda belum melakukan pendaftaran mahasiswa baru. Silakan lengkapi formulir untuk memulai.</p>
                                <button
                                    onClick={() => router.push('/dashboard/apply')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#052c65] hover:bg-[#042452] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#052c65] transition-colors"
                                >
                                    Mulai Pendaftaran
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Main Status Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl shadow-sm ${application.status === 'VERIFIED' ? 'bg-green-100 text-green-600' :
                                            application.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                application.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-amber-100 text-amber-600'
                                            }`}>
                                            {application.status === 'SUBMITTED' && <Clock size={32} />}
                                            {application.status === 'VERIFIED' && <CheckCircle size={32} />}
                                            {application.status === 'REJECTED' && <XCircle size={32} />}
                                            {application.status === 'DRAFT' && <Pencil size={32} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Status Pendaftaran Anda</p>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-2xl font-black text-[#052c65] uppercase">{application.status}</h4>
                                                {application.status === 'DRAFT' && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">BELUM SELESAI</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {application.status === 'DRAFT' && (
                                            <button
                                                onClick={() => router.push('/dashboard/apply')}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-[#052c65] text-white rounded-xl font-bold hover:bg-[#042452] transition-all shadow-md shadow-blue-900/10"
                                            >
                                                <Pencil size={18} /> Lanjutkan Pendaftaran
                                            </button>
                                        )}
                                        {application.status === 'VERIFIED' && (
                                            <>
                                                <button
                                                    onClick={() => router.push('/dashboard/card')}
                                                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-md shadow-green-900/10"
                                                >
                                                    <Download size={18} /> Download Kartu
                                                </button>
                                                <button
                                                    onClick={() => application.fileLink && window.open(application.fileLink, '_blank')}
                                                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                                >
                                                    <Eye size={18} /> Lihat Bukti
                                                </button>
                                            </>
                                        )}
                                        {application.status === 'SUBMITTED' && (
                                            <button
                                                onClick={() => application.fileLink && window.open(application.fileLink, '_blank')}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                            >
                                                <Eye size={18} /> Detail Pendaftaran
                                            </button>
                                        )}
                                        {application.status === 'REJECTED' && (
                                            <button
                                                onClick={() => router.push('/dashboard/apply')}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md shadow-red-900/10"
                                            >
                                                <AlertCircle size={18} /> Perbaiki Data
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Informasi Utama</h4>
                                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                            <table className="w-full text-sm">
                                                <tbody className="divide-y divide-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left font-bold text-gray-500 bg-gray-50/50 w-1/3">ID Pendaftaran</th>
                                                        <td className="px-6 py-4 font-black text-[#052c65]">#{String(application.id).padStart(6, '0')}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="px-6 py-4 text-left font-bold text-gray-500 bg-gray-50/50">Jalur</th>
                                                        <td className="px-6 py-4 font-bold text-blue-600 uppercase italic tracking-wide">{application.RegistrationPath?.name || '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="px-6 py-4 text-left font-bold text-gray-500 bg-gray-50/50">Prodi Pilihan</th>
                                                        <td className="px-6 py-4 font-bold text-gray-800">{application.Program1?.name || '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="px-6 py-4 text-left font-bold text-gray-500 bg-gray-50/50">Tanggal Daftar</th>
                                                        <td className="px-6 py-4 text-gray-500 font-medium">
                                                            {new Date(application.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Status Verifikasi</h4>
                                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[160px] flex flex-col justify-between">
                                            <div>
                                                {application.status === 'SUBMITTED' ? (
                                                    <div className="flex gap-3 text-blue-700">
                                                        <Clock className="shrink-0 animate-pulse" size={20} />
                                                        <p className="text-sm leading-relaxed font-medium">Data Anda sedang dalam proses peninjauan oleh tim admin. Silakan periksa dashboard secara berkala.</p>
                                                    </div>
                                                ) : application.status === 'VERIFIED' ? (
                                                    <div className="flex gap-3 text-green-700">
                                                        <CheckCircle className="shrink-0" size={20} />
                                                        <p className="text-sm leading-relaxed font-medium">Selamat! Data pendaftaran Anda telah berhasil diverifikasi. Silahkan download kartu peserta untuk tahap selanjutnya.</p>
                                                    </div>
                                                ) : application.status === 'REJECTED' ? (
                                                    <div className="flex gap-3 text-red-700">
                                                        <AlertCircle className="shrink-0" size={20} />
                                                        <p className="text-sm leading-relaxed font-medium">Mohon maaf, pendaftaran Anda belum disetujui. Silakan periksa kembali data Anda dan kirim ulang.</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-3 text-amber-700">
                                                        <AlertCircle className="shrink-0" size={20} />
                                                        <p className="text-sm leading-relaxed font-medium">Pendaftaran Anda masih dalam bentuk draft. Segera lengkapi data Anda untuk memproses pendaftaran.</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-4 border-t border-gray-50 mt-4 flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
                                                <span>Update Terakhir: {new Date(application.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="flex items-center gap-1"><BookOpen size={10} /> Panduan PMB</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* News and Schedule Shared Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* News Feed */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-[#052c65]" />
                        <h2 className="text-lg font-bold text-gray-800">Berita & Pengumuman PMB</h2>
                    </div>
                    <div className="space-y-4">
                        {news.length > 0 ? (
                            news.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                                                    {item.category}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#052c65] transition-colors mb-1 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                <p className="text-gray-400 text-sm">Belum ada berita terbaru.</p>
                            </div>
                        )}
                        {news.length > 0 && (
                            <button className="text-[#052c65] text-xs font-bold hover:underline">Lihat Semua Berita →</button>
                        )}
                    </div>
                </div>

                {/* Timeline Schedule */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={20} className="text-[#052c65]" />
                        <h2 className="text-lg font-bold text-gray-800">Jadwal Penting</h2>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {schedules.length > 0 ? (
                                schedules.map(item => (
                                    <div key={item.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-slate-50 rounded-lg border border-slate-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                {new Date(item.startDate).toLocaleDateString('id-ID', { month: 'short' })}
                                            </span>
                                            <span className="text-xl font-bold text-[#052c65]">
                                                {new Date(item.startDate).getDate()}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800 mb-0.5">{item.eventName}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                                            <div className="flex items-center gap-1 mt-1.5">
                                                <Calendar size={12} className="text-amber-500" />
                                                <span className="text-[10px] text-amber-600 font-medium italic">
                                                    {new Date(item.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                                    {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-gray-400 text-sm">Jadwal belum tersedia.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
