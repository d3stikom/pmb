"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Settings,
    Save,
    Calendar,
    AlertCircle,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    const [academicPeriod, setAcademicPeriod] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();

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

        if (role?.toUpperCase() !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.academic_period) {
                setAcademicPeriod(response.data.academic_period);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Gagal memuat pengaturan.');
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/settings`,
                { key: 'academic_period', value: academicPeriod },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Pengaturan berhasil disimpan.');
        } catch (err) {
            console.error('Error saving settings:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan pengaturan.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-[#052c65] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat pengaturan...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#052c65]">Pengaturan</h2>
                <p className="text-gray-500">Kelola konfigurasi global aplikasi.</p>
            </div>

            <div className="max-w-2xl">
                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Settings className="text-[#052c65]" size={20} />
                            <CardTitle className="text-lg">Konfigurasi Pendaftaran</CardTitle>
                        </div>
                        <CardDescription>Atus informasi dasar periode pendaftaran aktif.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSave} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100 animate-in fade-in duration-300">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2 border border-green-100 animate-in fade-in duration-300">
                                    <CheckCircle2 size={16} /> {success}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    Tahun Akademik
                                </label>
                                <Input
                                    required
                                    value={academicPeriod}
                                    onChange={(e) => setAcademicPeriod(e.target.value)}
                                    placeholder="Contoh: 2026/2027"
                                    className="focus-visible:ring-[#052c65]"
                                />
                                <p className="text-xs text-gray-400 italic">Format ini akan ditampilkan pada halaman pendaftaran dan surat keterangan.</p>
                            </div>

                            <div className="pt-4 border-t flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-[#052c65] hover:bg-[#042452] text-white flex items-center gap-2 shadow-lg transition-all"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Simpan Pengaturan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
