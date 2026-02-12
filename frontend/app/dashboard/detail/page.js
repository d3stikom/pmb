"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    Users as UsersIcon,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    FileText,
    Building2,
    Info,
    Eye,
    ExternalLink
} from 'lucide-react';

export default function ApplicantDetailPage() {
    const router = useRouter();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/pmb/my-application`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await response.json();

                if (!data.application) {
                    setError('Belum ada data pendaftaran');
                    setLoading(false);
                    return;
                }

                setApplication(data.application);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching application:', err);
                setError('Gagal memuat detail pendaftaran');
                setLoading(false);
            }
        };

        fetchApplication();
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 font-medium">Memuat detail pendaftaran...</p>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle size={48} className="text-red-500" />
                <h1 className="text-xl font-bold text-gray-800">{error || 'Data tidak ditemukan'}</h1>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-2 bg-[#052c65] text-white rounded-lg hover:bg-[#042452] transition-colors"
                >
                    Kembali ke Dashboard
                </button>
            </div>
        );
    }

    const getStatusInfo = (status) => {
        switch (status) {
            case 'SUBMITTED':
                return {
                    label: 'Submitted',
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <Clock size={24} className="text-blue-600" />
                };
            case 'VERIFIED':
                return {
                    label: 'Verified',
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <CheckCircle size={24} className="text-green-600" />
                };
            case 'REJECTED':
                return {
                    label: 'Rejected',
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <XCircle size={24} className="text-red-600" />
                };
            case 'DRAFT':
                return {
                    label: 'Draft',
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <AlertCircle size={24} className="text-gray-600" />
                };
            default:
                return {
                    label: status,
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <AlertCircle size={24} className="text-gray-600" />
                };
        }
    };

    const statusInfo = getStatusInfo(application.status);

    return (
        <div className="pb-10">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Detail Pendaftaran</h1>
                        <p className="text-sm text-gray-500">
                            <span className="text-blue-500">Dashboard</span> / Detail Pendaftaran
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-lg border-t-4 border-[#052c65] mb-6">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {statusInfo.icon}
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Status Pendaftaran</p>
                                <h2 className="text-2xl font-black text-[#052c65] uppercase">{application.status}</h2>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg border font-bold text-sm ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">ID Pendaftaran</p>
                            <p className="text-lg font-black text-[#052c65]">#{String(application.id).padStart(6, '0')}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Daftar</p>
                            <p className="text-sm font-medium text-gray-700">
                                {new Date(application.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Registration Choice */}
                    <div className="bg-white rounded-lg shadow border-t-4 border-blue-500">
                        <div className="px-4 py-3 border-b border-gray-100 bg-blue-50/50">
                            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                <GraduationCap size={18} />
                                Pilihan Pendaftaran
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Jalur Pendaftaran</label>
                                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    {application.RegistrationPath?.name || '-'}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                    </div>

                    {/* Personal Data */}
                    <div className="bg-white rounded-lg shadow border-t-4 border-green-500">
                        <div className="px-4 py-3 border-b border-gray-100 bg-green-50/50">
                            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                <UserIcon size={18} />
                                Data Pribadi
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Nama Lengkap</label>
                                    <p className="text-sm font-medium text-gray-900">{application.User?.name || '-'}</p>
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
                                            className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-flex items-center gap-1"
                                        >
                                            <MapPin size={12} /> Lihat di Google Maps
                                        </a>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Email</label>
                                    <p className="text-sm font-medium text-gray-900">{application.User?.email || '-'}</p>
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
                        </div>
                    </div>

                    {/* Education Data */}
                    <div className="bg-white rounded-lg shadow border-t-4 border-purple-500">
                        <div className="px-4 py-3 border-b border-gray-100 bg-purple-50/50">
                            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                <Building2 size={18} />
                                Data Pendidikan
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </div>

                    {/* Parent Data */}
                    <div className="bg-white rounded-lg shadow border-t-4 border-amber-500">
                        <div className="px-4 py-3 border-b border-gray-100 bg-amber-50/50">
                            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                <UsersIcon size={18} />
                                Data Orang Tua
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Marketing Data */}
                    <div className="bg-white rounded-lg shadow border-t-4 border-orange-500">
                        <div className="px-4 py-3 border-b border-gray-100 bg-orange-50/50">
                            <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2 uppercase tracking-wider">
                                <Info size={16} />
                                Data Marketing
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-orange-600 uppercase block mb-1">Nama Sponsor</label>
                                <p className="text-sm font-bold text-gray-900">{application.sponsorName || 'Tidak Ada'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-orange-600 uppercase block mb-1">Sumber Informasi</label>
                                <p className="text-sm font-medium text-gray-700">{application.informationSource || 'Tidak Ada'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Files */}
                    {(application.fileLink || application.paymentProofLink) && (
                        <div className="bg-white rounded-lg shadow border-t-4 border-indigo-500">
                            <div className="px-4 py-3 border-b border-gray-100 bg-indigo-50/50">
                                <h3 className="text-sm font-bold text-indigo-800 flex items-center gap-2 uppercase tracking-wider">
                                    <FileText size={16} />
                                    Berkas
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {application.fileLink && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Link Berkas Pendaftaran</label>
                                        <a
                                            href={application.fileLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                                        >
                                            <Eye size={14} /> Lihat Berkas
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>
                                )}
                                {application.paymentProofLink && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Bukti Transfer</label>
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
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="bg-white rounded-lg shadow p-4 text-xs space-y-3">
                        <div className="flex justify-between items-center text-gray-500">
                            <span>Terakhir Diperbarui</span>
                            <span className="font-medium">
                                {new Date(application.updatedAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <FileText size={14} /> Cetak Detail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
