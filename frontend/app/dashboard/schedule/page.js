"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Search,
    Plus,
    Calendar,
    Clock,
    FileText,
    AlertCircle,
    Loader2,
    Pencil,
    Trash2,
    X,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ScheduleManagementPage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('ADD'); // 'ADD' or 'EDIT'
    const [formData, setFormData] = useState({
        eventName: '',
        startDate: '',
        endDate: '',
        description: '',
        isActive: true
    });
    const [currentId, setCurrentId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token || !userData) {
            router.push('/login');
            return;
        }
        const user = JSON.parse(userData);
        if (user.role?.toUpperCase() !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }
        fetchSchedules();
    }, [router]);

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/info/admin/schedules`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching schedules:', err);
            setError('Gagal memuat data jadwal.');
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, item = null) => {
        setModalMode(mode);
        if (mode === 'EDIT' && item) {
            setCurrentId(item.id);
            setFormData({
                eventName: item.eventName,
                startDate: new Date(item.startDate).toISOString().split('T')[0],
                endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
                description: item.description || '',
                isActive: item.isActive
            });
        } else {
            setCurrentId(null);
            setFormData({
                eventName: '',
                startDate: '',
                endDate: '',
                description: '',
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
                await axios.post(`${API_URL}/api/info/schedules`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.put(`${API_URL}/api/info/schedules/${currentId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchSchedules();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving schedule:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan data jadwal.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/info/schedules/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSchedules();
        } catch (err) {
            console.error('Error deleting schedule:', err);
            alert('Gagal menghapus jadwal.');
        }
    };

    const filteredSchedules = schedules.filter(item =>
        item.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-[#052c65] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat data jadwal...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#052c65]">Jadwal Pelaksanaan PMB</h2>
                    <p className="text-gray-500">Kelola timeline dan jadwal penting penerimaan mahasiswa baru.</p>
                </div>
                <Button
                    onClick={() => handleOpenModal('ADD')}
                    className="bg-[#052c65] hover:bg-[#042452] text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Tambah Jadwal
                </Button>
            </div>

            {/* Content Card */}
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Cari nama kegiatan..."
                                className="pl-10 focus-visible:ring-[#052c65]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredSchedules.length === 0 ? (
                        <div className="p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Tidak ada jadwal</h3>
                            <p className="text-gray-500">Silakan tambahkan jadwal kegiatan baru.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold border-b border-gray-100">
                                        <th className="px-6 py-4">Nama Kegiatan</th>
                                        <th className="px-6 py-4">Tanggal Pelaksanaan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredSchedules.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 max-w-md">
                                                <div className="font-bold text-[#052c65]">{item.eventName}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                                        <Clock size={12} className="text-blue-500" />
                                                        {new Date(item.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    {item.endDate && (
                                                        <span className="text-[10px] text-gray-400 ml-4 italic">
                                                            s/d {new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.isActive ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                                                        <CheckCircle2 size={12} /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
                                                        <XCircle size={12} /> Non-Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenModal('EDIT', item)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
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
                                {modalMode === 'ADD' ? 'Tambah Jadwal Baru' : 'Edit Jadwal'}
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
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Kegiatan</label>
                                <Input
                                    required
                                    value={formData.eventName}
                                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                    placeholder="Contoh: Pendaftaran Gelombang 1"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal Mulai</label>
                                    <Input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal Selesai (Selesai)</label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Deskripsi / Detail</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-md text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Keterangan tambahan mengenai kegiatan..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActiveSche"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-[#052c65] border-gray-300 rounded focus:ring-[#052c65]"
                                />
                                <label htmlFor="isActiveSche" className="text-sm font-medium text-gray-700 cursor-pointer">Jadwal Aktif / Ditampilkan</label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={submitting}>Batal</Button>
                                <Button type="submit" className="bg-[#052c65] hover:bg-[#042452] text-white" disabled={submitting}>
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Simpan Jadwal'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
