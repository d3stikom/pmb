"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    ChevronLeft,
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    Users as UsersIcon,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    ShieldCheck,
    FileText,
    Building2,
    Briefcase,
    DollarSign,
    Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApplicationDetailPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                if (!token || !userData) {
                    router.push('/login');
                    return;
                }

                const parsedUser = JSON.parse(userData);
                setUserRole(parsedUser.role);

                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/pmb/applications/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplication(response.data.application);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching application:', err);
                setError(err.response?.data?.message || 'Gagal memuat detail pendaftaran.');
                setLoading(false);
            }
        };

        if (id) fetchApplication();
    }, [id, router]);

    const handleUpdateStatus = async (newStatus) => {
        const confirmMsg = newStatus === 'VERIFIED'
            ? 'Apakah Anda yakin ingin MEMVERIFIKASI pendaftaran ini?'
            : 'Apakah Anda yakin ingin MENOLAK pendaftaran ini?';

        if (!confirm(confirmMsg)) return;

        setUpdating(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/pmb/applications/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setApplication({ ...application, status: newStatus });
            alert(`Status berhasil diperbarui menjadi ${newStatus}`);
        } catch (err) {
            console.error('Error updating status:', err);
            alert(err.response?.data?.message || 'Gagal memperbarui status.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-[#052c65] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat detail pendaftaran...</p>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle size={48} className="text-red-500" />
                <h1 className="text-xl font-bold text-gray-800">{error || 'Data tidak ditemukan'}</h1>
                <Button onClick={() => router.push('/dashboard/all-applications')} variant="outline">
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    const getStatusInfo = (status) => {
        switch (status) {
            case 'SUBMITTED':
                return { label: 'Submitted', color: 'bg-blue-100 text-blue-800 border-blue-200' };
            case 'VERIFIED':
                return { label: 'Verified', color: 'bg-green-100 text-green-800 border-green-200' };
            case 'REJECTED':
                return { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' };
            case 'DRAFT':
                return { label: 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-200' };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
        }
    };

    const statusInfo = getStatusInfo(application.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/dashboard/all-applications')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{application.User?.name}</h1>
                            <Badge className={`${statusInfo.color} px-3 py-1 border`}>
                                {statusInfo.label}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500">ID Pendaftaran: {application.id} • Terdaftar pada {new Date(application.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {userRole === 'ADMIN' && application.status === 'SUBMITTED' && (
                        <>
                            <Button
                                onClick={() => handleUpdateStatus('REJECTED')}
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold"
                                disabled={updating}
                            >
                                <XCircle size={18} />
                                Tolak
                            </Button>
                            <Button
                                onClick={() => handleUpdateStatus('VERIFIED')}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                                disabled={updating}
                            >
                                <CheckCircle2 size={18} />
                                Verifikasi
                            </Button>
                        </>
                    )}
                    {application.status === 'VERIFIED' && (
                        <Badge className="bg-green-600 text-white px-4 py-2 text-sm font-bold flex items-center gap-2">
                            <ShieldCheck size={18} /> TERVERIFIKASI
                        </Badge>
                    )}
                    {userRole === 'ADMIN' && application.status === 'REJECTED' && (
                        <Button
                            onClick={() => handleUpdateStatus('SUBMITTED')}
                            variant="outline"
                            className="font-semibold"
                            disabled={updating}
                        >
                            Reset ke Submitted
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Data Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Choice Information */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-gray-100">
                            <CardTitle className="text-lg text-[#052c65] flex items-center gap-2">
                                <GraduationCap size={20} /> Pilihan Pendaftaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Jalur Pendaftaran</label>
                                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    {application.RegistrationPath?.name || '-'}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Pilihan 1</label>
                                    <p className="text-sm font-bold text-[#052c65] bg-[#052c65]/5 p-3 rounded-lg border border-[#052c65]/10">
                                        {application.Program1?.name || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Pilihan 2</label>
                                    <p className="text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {application.Program2?.name || '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Data */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                                <UserIcon size={20} /> Data Pribadi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Nama Lengkap</label>
                                    <p className="text-sm font-medium text-gray-900">{application.User?.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">NIK</label>
                                    <p className="text-sm font-medium text-gray-900">{application.nik || '-'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Alamat Lengkap</label>
                                    <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-line">
                                        {application.address || 'Alamat belum diisi'}
                                    </p>
                                    {application.mapLink && (
                                        <a
                                            href={application.mapLink.startsWith('http') ? application.mapLink : `https://www.google.com/maps/search/?api=1&query=${application.mapLink}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-bold text-blue-600 hover:underline mt-2 inline-flex items-center gap-1"
                                        >
                                            <MapPin size={10} /> Lihat di Google Maps
                                        </a>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Email</label>
                                    <p className="text-sm font-medium text-gray-900">{application.User?.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">No. HP / WhatsApp</label>
                                    <p className="text-sm font-medium text-gray-900">{application.phone || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Jenis Kelamin</label>
                                    <p className="text-sm font-medium text-gray-900">{application.gender || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tempat, Tanggal Lahir</label>
                                    <p className="text-sm font-medium text-gray-900">
                                        {application.birthPlace || '-'}, {application.birthDate ? new Date(application.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Agama</label>
                                    <p className="text-sm font-medium text-gray-900">{application.religion || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education Data */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                                <Building2 size={20} /> Data Pendidikan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Nama Sekolah</label>
                                    <p className="text-sm font-bold text-[#052c65]">{application.schoolName || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tipe Sekolah</label>
                                    <p className="text-sm font-medium text-gray-900">{application.schoolType || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tahun Lulus</label>
                                    <p className="text-sm font-medium text-gray-900">{application.graduationYear || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Provinsi Sekolah</label>
                                    <p className="text-sm font-medium text-gray-900">{application.schoolProvince || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Kota/Kabupaten Sekolah</label>
                                    <p className="text-sm font-medium text-gray-900">{application.schoolCity || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Parent Data */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                                <UsersIcon size={20} /> Data Orang Tua
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Nama Ayah</label>
                                    <p className="text-sm font-medium text-gray-900">{application.fatherName || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Nama Ibu</label>
                                    <p className="text-sm font-medium text-gray-900">{application.motherName || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">No. HP Orang Tua</label>
                                    <p className="text-sm font-medium text-gray-900">{application.parentPhone || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Pekerjaan Orang Tua</label>
                                    <p className="text-sm font-medium text-gray-900">{application.parentOccupation || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Penghasilan Orang Tua</label>
                                    <p className="text-sm font-medium text-gray-900">{application.parentSalary || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info Column */}
                <div className="space-y-6">
                    {/* Marketing Data */}
                    <Card className="border-none shadow-sm overflow-hidden bg-amber-50/30">
                        <CardHeader className="bg-amber-50 border-b border-amber-100">
                            <CardTitle className="text-sm font-bold text-amber-800 flex items-center gap-2 uppercase tracking-wider">
                                <Info size={16} /> Data Marketing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-amber-600 uppercase block mb-1">Nama Sponsor</label>
                                <p className="text-sm font-bold text-gray-900">{application.sponsorName || 'Tidak Ada'}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-amber-600 uppercase block mb-1">Sumber Informasi</label>
                                <p className="text-sm font-medium text-gray-700">{application.informationSource || 'Tidak Ada'}</p>
                            </div>
                            {application.fileLink && (
                                <div className="pt-2 border-t border-amber-100">
                                    <label className="text-[10px] font-bold text-amber-600 uppercase block mb-1">Link Berkas</label>
                                    <a
                                        href={application.fileLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <FileText size={12} /> Buka Link Berkas
                                    </a>
                                </div>
                            )}
                            {application.paymentProofLink && (
                                <div className="pt-2 border-t border-amber-100">
                                    <label className="text-[10px] font-bold text-amber-600 uppercase block mb-2">Bukti Transfer</label>
                                    <div className="bg-white rounded-lg border-2 border-green-200 overflow-hidden">
                                        <img
                                            src={application.paymentProofLink}
                                            alt="Bukti Transfer"
                                            className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(application.paymentProofLink, '_blank')}
                                            title="Klik untuk memperbesar"
                                        />
                                    </div>
                                    <p className="text-[9px] text-gray-500 mt-1 text-center italic">Klik gambar untuk memperbesar</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card className="border-none shadow-sm overflow-hidden text-xs">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Status Sync Sistem</span>
                                <span className="text-green-600 font-bold flex items-center gap-1">
                                    <ShieldCheck size={12} /> Live
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Terakhir Diperbarui</span>
                                <span className="font-medium">{new Date(application.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-[10px] mt-2 h-8 text-gray-500"
                                onClick={() => window.print()}
                            >
                                <FileText size={12} /> Cetak Formulir
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
