"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    FileText,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegistrationPathsPage() {
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Simple admin guard
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!token || role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        fetchPaths();
    }, []);

    const fetchPaths = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/master/paths', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPaths(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching paths:', err);
            setError('Gagal memuat data jalur pendaftaran.');
            setLoading(false);
        }
    };

    const filteredPaths = paths.filter(path =>
        path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (path.description && path.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (path.pathDescription && path.pathDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-[#ffc107] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#052c65]">Jalur Pendaftaran</h2>
                    <p className="text-gray-500">Kelola master data jalur pendaftaran mahasiswa baru.</p>
                </div>
                <Button className="bg-[#052c65] hover:bg-[#042452] text-white flex items-center gap-2">
                    <Plus size={18} />
                    Tambah Jalur
                </Button>
            </div>

            {/* Content Card */}
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Cari nama atau deskripsi jalur..."
                                className="pl-10 focus-visible:ring-[#052c65]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2 text-gray-600 border-gray-200">
                            <Filter size={18} />
                            Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {error ? (
                        <div className="p-8 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <p className="text-red-600 font-medium">{error}</p>
                            <Button variant="link" onClick={fetchPaths} className="text-[#052c65] mt-2">Coba Lagi</Button>
                        </div>
                    ) : filteredPaths.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Tidak ada data</h3>
                            <p className="text-gray-500">Jalur pendaftaran tidak ditemukan dengan pencarian "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold border-b border-gray-100">
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Nama Jalur</th>
                                        <th className="px-6 py-4">Periode</th>
                                        <th className="px-6 py-4">Deskripsi Singkat</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPaths.map((path) => (
                                        <tr key={path.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-400">#{path.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#052c65]">{path.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                                                    {path.startDate && path.endDate ? (
                                                        <>{new Date(path.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(path.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                                                    ) : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 max-w-xs truncate" title={path.description}>{path.description || '-'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {path.isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        <CheckCircle2 size={12} />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                        <XCircle size={12} />
                                                        Non-Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="p-2 text-gray-400 hover:text-[#052c65] hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 shadow-sm">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Footer Summary */}
            <div className="text-sm text-gray-500 italic">
                Menampilkan {filteredPaths.length} dari {paths.length} total jalur pendaftaran.
            </div>
        </div>
    );
}
