"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, User, School, Users, FileText, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { cn } from "@/lib/utils";

const steps = [
    { title: "Jalur & Prodi", icon: <FileText size={20} /> },
    { title: "Data Pribadi", icon: <User size={20} /> },
    { title: "Data Sekolah", icon: <School size={20} /> },
    { title: "Data Orang Tua", icon: <Users size={20} /> },
];

export default function ApplyPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [token, setToken] = useState('');
    const [paths, setPaths] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [formData, setFormData] = useState({
        registrationPathId: '',
        studyProgramId: '',
        studyProgramId2: '',
        nik: '',
        gender: '',
        birthPlace: '',
        birthDate: '',
        religion: '',
        phone: '',
        schoolName: '',
        schoolType: '',
        schoolProvince: '',
        schoolCity: '',
        graduationYear: new Date().getFullYear(),
        fatherName: '',
        motherName: '',
        parentPhone: '',
        parentOccupation: '',
        parentSalary: '',
        sponsorName: '',
        informationSource: '',
        fileLink: '',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        setToken(token);

        const fetchData = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            try {
                const [pathsRes, programsRes, myAppRes] = await Promise.all([
                    fetch(`${API_URL}/api/master/paths`),
                    fetch(`${API_URL}/api/master/programs`),
                    fetch(`${API_URL}/api/pmb/my-application`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                const pathsData = await pathsRes.json();
                const programsData = await programsRes.json();
                const myAppData = await myAppRes.json();

                setPaths(pathsData);
                setPrograms(programsData);

                if (myAppData.application) {
                    const app = myAppData.application;
                    setFormData({
                        registrationPathId: app.registrationPathId || '',
                        studyProgramId: app.studyProgramId || '',
                        studyProgramId2: app.studyProgramId2 || '',
                        fileLink: app.fileLink || '',
                        nik: app.nik || '',
                        gender: app.gender || '',
                        birthPlace: app.birthPlace || '',
                        birthDate: app.birthDate || '',
                        religion: app.religion || '',
                        phone: app.phone || '',
                        schoolName: app.schoolName || '',
                        schoolType: app.schoolType || '',
                        schoolProvince: app.schoolProvince || '',
                        schoolCity: app.schoolCity || '',
                        graduationYear: app.graduationYear || new Date().getFullYear(),
                        fatherName: app.fatherName || '',
                        motherName: app.motherName || '',
                        parentPhone: app.parentPhone || '',
                        parentOccupation: app.parentOccupation || '',
                        parentSalary: app.parentSalary || '',
                        sponsorName: app.sponsorName || '',
                        informationSource: app.informationSource || '',
                    });
                } else if (pathsData.length > 0 && programsData.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        registrationPathId: pathsData[0].id,
                        studyProgramId: programsData[0].id,
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Gagal memuat data formulir.");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/pmb/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, status: 'SUBMITTED' }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Gagal menyimpan data');
            }

            setSuccess('Pendaftaran berhasil diperbarui!');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffc107]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#052c65]">Formulir Pendaftaran Mahasiswa Baru</h1>
                <p className="text-slate-500">Silakan lengkapi seluruh tahapan formulir di bawah ini dengan data yang benar.</p>
            </div>

            {/* Stepper Indicator */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hidden md:block">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center gap-2 group">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                currentStep === index
                                    ? "bg-[#052c65] text-white ring-4 ring-[#052c65]/20 shadow-lg scale-110"
                                    : (currentStep > index ? "bg-[#ffc107] text-[#052c65]" : "bg-white text-slate-400 border-2 border-slate-100")
                            )}>
                                {currentStep > index ? <CheckCircle2 size={24} /> : step.icon}
                            </div>
                            <span className={cn(
                                "text-xs font-bold transition-colors",
                                currentStep === index ? "text-[#052c65]" : "text-slate-400"
                            )}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-[#052c65]">Langkah {currentStep + 1} dari {steps.length}</span>
                <span className="text-sm text-slate-500">{steps[currentStep].title}</span>
            </div>

            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white min-h-[500px]">
                <CardHeader className="bg-[#052c65] text-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            {steps[currentStep].icon}
                        </div>
                        <div>
                            <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                            <CardDescription className="text-indigo-100 opacity-80">
                                Tahap {currentStep + 1}: {steps[currentStep].title}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 flex items-center border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm mb-6 flex items-center border border-green-100 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 size={20} className="mr-3 flex-shrink-0" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step 1: Jalur & Prodi */}
                        {currentStep === 0 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                                    <h3 className="text-sm font-bold text-[#052c65] uppercase tracking-wider mb-1">Informasi Gelombang</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Pilihlah jalur pendaftaran dan program studi yang Anda minati. Anda dapat memilih maksimal 2 program studi pilihan.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Jalur Pendaftaran</Label>
                                        <select
                                            className="form-select w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white text-sm"
                                            name="registrationPathId"
                                            value={formData.registrationPathId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih Jalur</option>
                                            {paths.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-bold">Program Studi Pilihan 1</Label>
                                            <select
                                                className="form-select w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white text-sm"
                                                name="studyProgramId"
                                                value={formData.studyProgramId}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Pilih Prodi 1</option>
                                                {programs.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.degree})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-bold">Program Studi Pilihan 2 (Opsional)</Label>
                                            <select
                                                className="form-select w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white text-sm"
                                                name="studyProgramId2"
                                                value={formData.studyProgramId2}
                                                onChange={handleChange}
                                            >
                                                <option value="">Pilih Prodi 2</option>
                                                {programs.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.degree})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                    <Label className="text-slate-700 font-bold">Link Berkas Pendaftaran (Google Drive/Cloud)</Label>
                                    <Input
                                        name="fileLink"
                                        placeholder="https://drive.google.com/..."
                                        value={formData.fileLink}
                                        onChange={handleChange}
                                        className="p-6 rounded-xl border-slate-200 focus:ring-[#052c65]"
                                        required
                                    />
                                    <p className="text-[10px] text-slate-400 italic">Pastikan link berkas dapat diakses oleh panitia PMB.</p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Data Pribadi */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">NIK (No. KTP / Kartu Keluarga)</Label>
                                        <Input
                                            name="nik"
                                            placeholder="Masukkan 16 digit NIK"
                                            maxLength={16}
                                            value={formData.nik}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200 focus:ring-[#052c65]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Jenis Kelamin</Label>
                                        <select
                                            className="form-select w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white text-sm"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih Jenis Kelamin</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Tempat Lahir</Label>
                                        <Input
                                            name="birthPlace"
                                            placeholder="Kota Kelahiran"
                                            value={formData.birthPlace}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Tanggal Lahir</Label>
                                        <Input
                                            name="birthDate"
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Agama</Label>
                                        <select
                                            className="form-select w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white text-sm"
                                            name="religion"
                                            value={formData.religion}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih Agama</option>
                                            <option value="Islam">Islam</option>
                                            <option value="Kristen">Kristen</option>
                                            <option value="Katolik">Katolik</option>
                                            <option value="Hindu">Hindu</option>
                                            <option value="Budha">Budha</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">No. WhatsApp Aktif</Label>
                                        <Input
                                            name="phone"
                                            placeholder="Contoh: 08123456789"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Data Sekolah */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Nama Asal Sekolah / Kampus</Label>
                                        <Input
                                            name="schoolName"
                                            placeholder="Nama Lengkap Sekolah"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-bold">Jenis Sekolah</Label>
                                            <select
                                                className="form-select w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white text-sm"
                                                name="schoolType"
                                                value={formData.schoolType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Pilih Jenis</option>
                                                <option value="SMA">SMA</option>
                                                <option value="SMK">SMK</option>
                                                <option value="MA">MA</option>
                                                <option value="Diploma/Sarjana">Transfer (D3/S1)</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-bold">Tahun Lulus</Label>
                                            <Input
                                                name="graduationYear"
                                                type="number"
                                                placeholder="Contoh: 2026"
                                                value={formData.graduationYear}
                                                onChange={handleChange}
                                                className="p-6 rounded-xl border-slate-200"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-bold">Provinsi Sekolah</Label>
                                            <Input
                                                name="schoolProvince"
                                                placeholder="Contoh: Jawa Timur"
                                                value={formData.schoolProvince}
                                                onChange={handleChange}
                                                className="p-6 rounded-xl border-slate-200"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-bold">Kota/Kabupaten Sekolah</Label>
                                            <Input
                                                name="schoolCity"
                                                placeholder="Contoh: Banyuwangi"
                                                value={formData.schoolCity}
                                                onChange={handleChange}
                                                className="p-6 rounded-xl border-slate-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Data Orang Tua */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Nama Lengkap Ayah</Label>
                                        <Input
                                            name="fatherName"
                                            value={formData.fatherName}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Nama Lengkap Ibu</Label>
                                        <Input
                                            name="motherName"
                                            value={formData.motherName}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">No. WhatsApp Orang Tua</Label>
                                        <Input
                                            name="parentPhone"
                                            placeholder="Contoh: 08123456789"
                                            value={formData.parentPhone}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Pekerjaan Orang Tua</Label>
                                        <Input
                                            name="parentOccupation"
                                            placeholder="Contoh: PNS / Wiraswasta"
                                            value={formData.parentOccupation}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-slate-700 font-bold">Rata-rata Penghasilan / Bulan</Label>
                                        <select
                                            className="form-select w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white text-sm"
                                            name="parentSalary"
                                            value={formData.parentSalary}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih Penghasilan</option>
                                            <option value="< 1 Juta">&lt; 1 Juta</option>
                                            <option value="1 Juta - 3 Juta">1 Juta - 3 Juta</option>
                                            <option value="3 Juta - 5 Juta">3 Juta - 5 Juta</option>
                                            <option value="> 5 Juta">&gt; 5 Juta</option>
                                        </select>
                                    </div>

                                    {/* New Marketing Fields */}
                                    <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100">
                                        <Label className="text-slate-700 font-bold text-lg">Informasi Tambahan</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Nama Sponsor (Jika ada)</Label>
                                        <Input
                                            name="sponsorName"
                                            placeholder="Contoh: Nama Pemberi Referensi"
                                            value={formData.sponsorName}
                                            onChange={handleChange}
                                            className="p-6 rounded-xl border-slate-200"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold">Sumber Informasi PMB</Label>
                                        <select
                                            className="form-select w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#052c65]/20 focus:border-[#052c65] transition-all bg-white text-sm"
                                            name="informationSource"
                                            value={formData.informationSource}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih Sumber Informasi</option>
                                            <option value="Alumni STIKOM">Alumni STIKOM</option>
                                            <option value="Mahasiswa Aktif STIKOM">Mahasiswa Aktif STIKOM</option>
                                            <option value="Guru BK / Sekolah">Guru BK / Sekolah</option>
                                            <option value="Sosial Media / Akun IG STIKOM">Sosial Media / Akun IG STIKOM</option>
                                            <option value="Promosi STIKOM di Sekolah">Promosi STIKOM di Sekolah</option>
                                            <option value="Pameran Pendidikan">Pameran Pendidikan</option>
                                            <option value="Rekomendasi Saudara / Orang Tua">Rekomendasi Saudara / Orang Tua</option>
                                            <option value="Banner / Baliho">Banner / Baliho</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 0 || loading}
                                className="rounded-xl px-6 py-6 border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                <ChevronLeft size={20} className="mr-2" />
                                Kembali
                            </Button>

                            {currentStep === steps.length - 1 ? (
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl px-8 py-6 bg-[#ffc107] text-[#052c65] hover:bg-[#e0a800] font-bold shadow-lg shadow-[#ffc107]/20"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#052c65] border-t-transparent rounded-full animate-spin" />
                                            Menyimpan...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Finalisasi & Simpan <Save size={20} />
                                        </span>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="rounded-xl px-8 py-6 bg-[#052c65] text-white hover:bg-[#042452] font-bold shadow-lg shadow-[#052c65]/20"
                                >
                                    Selanjutnya
                                    <ChevronRight size={20} className="ml-2" />
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
