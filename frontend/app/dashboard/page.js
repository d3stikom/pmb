"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileText, CheckCircle, AlertCircle, TrendingUp, ShoppingBag, BarChart2, Clock, XCircle } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(userData));

        const fetchApplication = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/pmb/my-application', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setApplication(data.application);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [router]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div>
            {/* Content Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                </div>
                <div className="text-sm text-gray-500">
                    <span className="text-blue-500">Home</span> / Dashboard
                    <span className="text-[#052c65]">Home</span> / Dashboard
                </div>
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Box 1 */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center relative overflow-hidden group border-b-4 border-[#052c65]">
                    <div className="p-3 rounded bg-[#052c65] text-white mr-4 transition-colors">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase">New Orders</p>
                        <h3 className="text-xl font-bold text-gray-800">150</h3>
                    </div>
                </div>

                {/* Box 2 */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center relative overflow-hidden group border-b-4 border-green-500">
                    <div className="p-3 rounded bg-green-500 text-white mr-4 transition-colors">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase">Bounce Rate</p>
                        <h3 className="text-xl font-bold text-gray-800">53%</h3>
                    </div>
                </div>

                {/* Box 3 */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center relative overflow-hidden group border-b-4 border-[#ffc107]">
                    <div className="p-3 rounded bg-[#ffc107] text-[#052c65] mr-4 transition-colors">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase">Registrations</p>
                        <h3 className="text-xl font-bold text-gray-800">44</h3>
                    </div>
                </div>

                {/* Box 4 */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center relative overflow-hidden group border-b-4 border-red-500">
                    <div className="p-3 rounded bg-red-500 text-white mr-4 transition-colors">
                        <BarChart2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase">Unique Visitors</p>
                        <h3 className="text-xl font-bold text-gray-800">65</h3>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-t-lg border-t-4 border-[#052c65] shadow-lg">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                        <FileText size={18} />
                        Status Pendaftaran
                    </h3>
                </div>
                <div className="p-6">
                    <div className="bg-blue-50 border-l-4 border-[#052c65] p-4 mb-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full ${application.status === 'VERIFIED' ? 'bg-green-100 text-green-600' :
                                            application.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                'bg-blue-100 text-[#052c65]'
                                        }`}>
                                        {application.status === 'SUBMITTED' && <Clock className="w-6 h-6" />}
                                        {application.status === 'VERIFIED' && <CheckCircle className="w-6 h-6" />}
                                        {application.status === 'REJECTED' && <XCircle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Status Pendaftaran</p>
                                        <h4 className="text-xl font-bold uppercase tracking-wide text-[#052c65]">{application.status}</h4>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b bg-gray-50">
                                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-1/3">Jalur</th>
                                                <td className="px-4 py-3 font-medium">{application.RegistrationPath?.name || '-'}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Prodi</th>
                                                <td className="px-4 py-3 font-medium">{application.StudyProgram?.name || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Terdaftar</th>
                                                <td className="px-4 py-3 font-medium text-gray-500">
                                                    {new Date(application.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-md font-semibold text-gray-700">Data Sekolah</h4>
                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b bg-gray-50">
                                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-1/3">Asal Sekolah</th>
                                                <td className="px-4 py-3 font-medium">{application.schoolName}</td>
                                            </tr>
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tahun Lulus</th>
                                                <td className="px-4 py-3 font-medium">{application.graduationYear}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg flex gap-3 border border-yellow-100 mt-2">
                                    <AlertCircle className="text-yellow-500 shrink-0" size={20} />
                                    <p className="text-xs text-yellow-700 leading-relaxed">
                                        Silakan pantau dashboard ini secara berkala untuk perubahan status verifikasi oleh petugas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
