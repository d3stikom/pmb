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
    Loader2,
    Pencil,
    Trash2,
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegistrationPathsPage() {
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('ADD'); // 'ADD' or 'EDIT'
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        pathDescription: '',
        startDate: '',
        endDate: '',
        isActive: true
    });
    const [currentId, setCurrentId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const legacyRole = localStorage.getItem('role');

        if (!token) {
            router.push('/dashboard');
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

        if (role?.toUpperCase() !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        fetchPaths();
    }, []);

    const fetchPaths = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/master/admin/paths`, {
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

    const handleOpenModal = (mode, path = null) => {
        setModalMode(mode);
        if (mode === 'EDIT' && path) {
            setCurrentId(path.id);
            setFormData({
                name: path.name,
                description: path.description || '',
                pathDescription: path.pathDescription || '',
                startDate: path.startDate ? new Date(path.startDate).toISOString().split('T')[0] : '',
                endDate: path.endDate ? new Date(path.endDate).toISOString().split('T')[0] : '',
                isActive: path.isActive
            });
        } else {
            setCurrentId(null);
            setFormData({
                name: '',
                description: '',
                pathDescription: '',
                startDate: '',
                endDate: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            if (modalMode === 'ADD') {
                await axios.post(`${API_URL}/api/master/paths`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.put(`${API_URL}/api/master/paths/${currentId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchPaths();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving path:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan data.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus jalur ini?')) return;
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/master/paths/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPaths();
        } catch (err) {
            console.error('Error deleting path:', err);
            alert('Gagal menghapus data.');
        }
    };

    const filteredPaths = paths.filter(path =>
        path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (path.description && path.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-[#052c65] animate-spin mb-4" />
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
                <Button
                    onClick={() => handleOpenModal('ADD')}
                    className="bg-[#052c65] hover:bg-[#042452] text-white flex items-center gap-2"
                >
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
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredPaths.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Tidak ada data</h3>
                            <p className="text-gray-500">Jalur pendaftaran tidak ditemukan</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold border-b border-gray-100">
                                        <th className="px-6 py-4">Nama Jalur</th>
                                        <th className="px-6 py-4">Periode</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPaths.map((path) => (
                                        <tr key={path.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#052c65]">{path.name}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{path.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                                                    {path.startDate ? new Date(path.startDate).toLocaleDateString('id-ID') : '-'} s/d {path.endDate ? new Date(path.endDate).toLocaleDateString('id-ID') : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {path.isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        <CheckCircle2 size={12} /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                        <XCircle size={12} /> Non-Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenModal('EDIT', path)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(path.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-bold text-[#052c65]">
                                {modalMode === 'ADD' ? 'Tambah Jalur Pendaftaran' : 'Edit Jalur Pendaftaran'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Jalur</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: REGULER"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Deskripsi Singkat</label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Contoh: Jalur Masuk Reguler"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal Mulai</label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal Selesai</label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-[#052c65] border-gray-300 rounded focus:ring-[#052c65]"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Status Aktif</label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={submitting}>Batal</Button>
                                <Button type="submit" className="bg-[#052c65] hover:bg-[#042452] text-white" disabled={submitting}>
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Simpan Data'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
