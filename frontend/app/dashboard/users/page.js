"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Search,
    Plus,
    Users,
    AlertCircle,
    Loader2,
    Pencil,
    Trash2,
    X,
    User as UserIcon,
    Shield,
    Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('ADD'); // 'ADD' or 'EDIT'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'PENDAFTAR',
        studyProgramId: ''
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

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            const [usersRes, programsRes] = await Promise.all([
                axios.get(`${API_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/master/programs`)
            ]);
            setUsers(usersRes.data);
            setPrograms(programsRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Gagal memuat data user.');
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        if (mode === 'EDIT' && user) {
            setCurrentId(user.id);
            setFormData({
                name: user.name,
                email: user.email,
                password: '', // Password stay empty on edit unless reset
                role: user.role,
                studyProgramId: user.studyProgramId || ''
            });
        } else {
            setCurrentId(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'PENDAFTAR',
                studyProgramId: ''
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
            const dataToSubmit = { ...formData };
            if (modalMode === 'EDIT' && !dataToSubmit.password) {
                delete dataToSubmit.password;
            }
            if (!dataToSubmit.studyProgramId) dataToSubmit.studyProgramId = null;

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (modalMode === 'ADD') {
                await axios.post(`${API_URL}/api/users`, dataToSubmit, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.put(`${API_URL}/api/users/${currentId}`, dataToSubmit, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchData();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving user:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan data.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Gagal menghapus data.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">ADMIN</span>;
            case 'PRODI': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">PRODI</span>;
            default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">PENDAFTAR</span>;
        }
    };

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#052c65]">Manajemen User</h2>
                    <p className="text-gray-500">Kelola akun pengguna dan hak akses sistem.</p>
                </div>
                <Button
                    onClick={() => handleOpenModal('ADD')}
                    className="bg-[#052c65] hover:bg-[#042452] text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Tambah User
                </Button>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Cari nama atau email..."
                            className="pl-10 focus-visible:ring-[#052c65]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredUsers.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Tidak ada user</h3>
                            <p className="text-gray-500">Coba kata kunci pencarian lain</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                        <UserIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[#052c65]">{user.name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Mail size={12} /> {user.email}
                                                        </div>
                                                        {user.StudyProgram && (
                                                            <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                                                                Prodi: {user.StudyProgram.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenModal('EDIT', user)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(user.id)}
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
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-bold text-[#052c65]">
                                {modalMode === 'ADD' ? 'Tambah User Baru' : 'Edit User'}
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
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Lengkap</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nama User"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                                    {modalMode === 'EDIT' ? 'Password (Kosongkan jika tidak diubah)' : 'Password'}
                                </label>
                                <Input
                                    required={modalMode === 'ADD'}
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="******"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Role</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65]"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="PRODI">PRODI</option>
                                        <option value="PENDAFTAR">PENDAFTAR</option>
                                    </select>
                                </div>
                                {formData.role === 'PRODI' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Program Studi</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65]"
                                            value={formData.studyProgramId}
                                            onChange={(e) => setFormData({ ...formData, studyProgramId: e.target.value })}
                                            required={formData.role === 'PRODI'}
                                        >
                                            <option value="">Pilih Prodi</option>
                                            {programs.map(p => (
                                                <option key={p.id} value={p.id}>{p.code}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
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
