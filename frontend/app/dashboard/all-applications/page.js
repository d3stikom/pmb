"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ClipboardList,
    Search,
    Filter,
    Eye,
    MoreHorizontal,
    Clock,
    CheckCircle,
    XCircle,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AllApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const legacyRole = localStorage.getItem('role');

        if (!token) {
            router.push('/login');
            return;
        }

        let role = legacyRole;
        if (userData) {
            try {
                const user = JSON.parse(userData);
                role = user.role;
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }

        const upperRole = role?.toUpperCase();
        if (upperRole !== 'ADMIN' && upperRole !== 'PRODI') {
            router.push('/dashboard');
            return;
        }

        const fetchApplications = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            try {
                const res = await fetch(`${API_URL}/api/pmb/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.applications) {
                    setApplications(data.applications);
                }
            } catch (err) {
                console.error('Error fetching applications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [router]);

    const handleUpdateStatus = async (id, newStatus) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const confirmMsg = newStatus === 'VERIFIED'
            ? 'Verifikasi pendaftaran ini?'
            : 'Tolak pendaftaran ini?';

        if (!confirm(confirmMsg)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/pmb/applications/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh data locally
                setApplications(applications.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                ));
            } else {
                const data = await res.json();
                alert(data.message || 'Gagal memperbarui status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Terjadi kesalahan jaringan');
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.nik?.includes(searchTerm);

        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'SUBMITTED':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Submitted</span>;
            case 'VERIFIED':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Verified</span>;
            case 'REJECTED':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
            case 'DRAFT':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#052c65]"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Semua Pendaftaran</h1>
                    <p className="text-sm text-gray-500">Kelola dan lihat semua data pendaftaran mahasiswa baru.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download size={16} />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama atau NIK..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-gray-400" size={18} />
                    <select
                        className="flex-1 md:w-48 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Pendaftar</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Jalur</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Prodi Pilihan</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sumber/Sponsor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#052c65]/10 flex items-center justify-center text-[#052c65] font-bold">
                                                    {app.User?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{app.User?.name}</div>
                                                    <div className="text-xs text-gray-500">NIK: {app.nik || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 font-medium">{app.RegistrationPath?.name || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-medium text-gray-800">1. {app.Program1?.name || '-'}</div>
                                            <div className="text-[10px] text-gray-500">2. {app.Program2?.name || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs font-medium text-[#052c65]">{app.informationSource || '-'}</div>
                                            <div className="text-[10px] text-gray-500">Sponsor: {app.sponsorName || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="text-[#052c65] hover:bg-[#052c65]/10"
                                                    onClick={() => router.push(`/dashboard/all-applications/${app.id}`)}
                                                    title="Lihat Detail"
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                {app.status === 'SUBMITTED' && (
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="text-green-600 hover:bg-green-50"
                                                            onClick={() => handleUpdateStatus(app.id, 'VERIFIED')}
                                                            title="Verifikasi"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="text-red-600 hover:bg-red-50"
                                                            onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                                            title="Tolak"
                                                        >
                                                            <XCircle size={16} />
                                                        </Button>
                                                    </div>
                                                )}
                                                <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-gray-600">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <ClipboardList size={40} className="text-gray-200" />
                                            <p>Tidak ada pendaftaran yang ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
