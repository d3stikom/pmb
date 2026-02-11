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
    X,
    Newspaper,
    Image as ImageIcon,
    Eye,
    EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewsManagementPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('ADD'); // 'ADD' or 'EDIT'
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'PMB',
        image: '',
        isPublished: true
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
        fetchNews();
    }, [router]);

    const fetchNews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/info/admin/news`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNews(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching news:', err);
            setError('Gagal memuat data berita.');
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, item = null) => {
        setModalMode(mode);
        if (mode === 'EDIT' && item) {
            setCurrentId(item.id);
            setFormData({
                title: item.title,
                content: item.content,
                category: item.category || 'PMB',
                image: item.image || '',
                isPublished: item.isPublished
            });
        } else {
            setCurrentId(null);
            setFormData({
                title: '',
                content: '',
                category: 'PMB',
                image: '',
                isPublished: true
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
            const token = localStorage.getItem('token');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (modalMode === 'ADD') {
                await axios.post(`${API_URL}/api/info/news`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.put(`${API_URL}/api/info/news/${currentId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchNews();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving news:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan data berita.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/info/news/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNews();
        } catch (err) {
            console.error('Error deleting news:', err);
            alert('Gagal menghapus berita.');
        }
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-[#052c65] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat data berita...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#052c65]">Manajemen Berita PMB</h2>
                    <p className="text-gray-500">Kelola informasi dan berita terbaru untuk pendaftar.</p>
                </div>
                <Button
                    onClick={() => handleOpenModal('ADD')}
                    className="bg-[#052c65] hover:bg-[#042452] text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Tambah Berita
                </Button>
            </div>

            {/* Content Card */}
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Cari judul berita..."
                                className="pl-10 focus-visible:ring-[#052c65]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredNews.length === 0 ? (
                        <div className="p-12 text-center">
                            <Newspaper className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Tidak ada berita</h3>
                            <p className="text-gray-500">Silakan tambahkan berita baru.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold border-b border-gray-100">
                                        <th className="px-6 py-4">Berita</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Tanggal</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredNews.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 max-w-md">
                                                <div className="font-bold text-[#052c65] line-clamp-1">{item.title}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1">{item.content}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.isPublished ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                                                        <Eye size={10} /> Terbit
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
                                                        <EyeOff size={10} /> Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString('id-ID')}
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
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-bold text-[#052c65]">
                                {modalMode === 'ADD' ? 'Tambah Berita Baru' : 'Edit Berita'}
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
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Judul Berita</label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Masukkan judul berita..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kategori</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65]"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="PMB">PMB General</option>
                                        <option value="AKADEMIK">Akademik</option>
                                        <option value="BEASISWA">Beasiswa</option>
                                        <option value="PENGUMUMAN">Pengumuman</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Status Terbit</label>
                                    <div className="flex items-center gap-4 h-10">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isPublished}
                                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                                className="w-4 h-4 text-[#052c65] border-gray-300 rounded focus:ring-[#052c65]"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Publikasikan</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Isi Berita</label>
                                <textarea
                                    required
                                    className="w-full px-3 py-2 border rounded-md text-sm min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65]"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Tulis isi berita lengkap di sini..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">URL Gambar (Opsional)</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <div className="p-2 bg-gray-100 rounded text-gray-400">
                                        <ImageIcon size={20} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={submitting}>Batal</Button>
                                <Button type="submit" className="bg-[#052c65] hover:bg-[#042452] text-white" disabled={submitting}>
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Simpan Berita'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
