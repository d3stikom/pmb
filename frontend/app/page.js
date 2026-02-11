"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Award, BookOpen, Clock, Loader2, Search, ShieldCheck } from 'lucide-react';

function ProgramSectionDynamic() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/master/programs`);
        setPrograms(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 text-[#ffc107] animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {programs.slice(0, 4).map((prog) => (
        <div key={prog.id} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#ffc107] hover:shadow-lg transition-all text-left group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-[#052c65] group-hover:text-[#ffc107] mb-3 transition-colors">{prog.name}</h3>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-[#052c65] shadow-sm">{prog.degree}</span>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Program studi {prog.name} di Stikom Banyuwangi dirancang untuk menghasilkan lulusan yang kompeten di bidang teknologi digital.
          </p>
          <ul className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium mb-6">
            <li className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
              <Clock size={16} className="mr-2 text-[#ffc107]" />
              {prog.degree === 'S1' ? '8 Semester' : '6 Semester'}
            </li>
            <li className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
              <Award size={16} className="mr-2 text-[#ffc107]" />
              Gelar {prog.degree === 'S1' ? 'S.Kom' : 'A.Md.Kom'}
            </li>
          </ul>
          <div className="flex items-center justify-between gap-4">
            <Link href={`/programs/${prog.id}`}>
              <Button variant="link" className="text-[#052c65] font-bold p-0 flex items-center gap-2 hover:text-[#ffc107] transition-all">
                Selengkapnya
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-[#052c65] text-[#052c65] hover:bg-[#052c65] hover:text-white font-bold px-4 py-2 rounded-lg transition-all">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsSectionDynamic() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/info/news`);
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return null;
  if (news.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#052c65] mb-4">Berita & Pengumuman</h2>
          <div className="w-20 h-1.5 bg-[#ffc107] mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col">
              {item.image && (
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-50 text-[#052c65] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{item.category}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-bold text-[#052c65] mb-3 group-hover:text-[#ffc107] transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{item.content}</p>
                <Link href={`/news/${item.id}`} className="inline-flex items-center text-[#052c65] font-bold text-sm hover:gap-2 transition-all">
                  Baca Selengkapnya &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsSectionDynamic() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/info/schedules`);
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return null;
  if (events.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#052c65] mb-4">Agenda & Jadwal Penting</h2>
          <div className="w-20 h-1.5 bg-[#ffc107] mx-auto rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 items-center hover:border-[#ffc107] transition-all">
              <div className="flex flex-col items-center justify-center min-w-[100px] h-[100px] bg-white rounded-2xl shadow-sm border border-slate-100">
                <span className="text-xs font-bold text-gray-400 uppercase">{new Date(event.startDate).toLocaleDateString('id-ID', { month: 'short' })}</span>
                <span className="text-4xl font-black text-[#052c65]">{new Date(event.startDate).getDate()}</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-[#052c65] mb-2">{event.eventName}</h3>
                <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-amber-600">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(event.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {event.endDate && ` s/d ${new Date(event.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                  </span>
                </div>
              </div>
              <Link href="/register">
                <Button className="bg-[#052c65] hover:bg-[#042452] text-white px-6 rounded-full font-bold">Daftar</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValidationSection() {
  const [searchId, setSearchId] = useState('');
  const router = useRouter();

  const handleCheck = (e) => {
    e.preventDefault();
    const id = searchId.trim();
    if (!id) return;

    console.log('Verifying ID:', id);
    router.push(`/verify/${id}`);
  };

  return (
    <section className="py-24 bg-[#052c65] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <ShieldCheck size={14} /> Keamanan Pendaftaran
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">Cek Validasi <br /><span className="text-[#ffc107]">Pendaftaran Anda</span></h2>
              <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
                Gunakan fitur ini untuk memverifikasi keaslian kartu pendaftaran Anda. Masukkan ID Pendaftaran yang tertera pada kartu atau formulir.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <form onSubmit={handleCheck} className="flex flex-col gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-[#ffc107] transition-colors">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan ID Pendaftaran..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full md:w-64 bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-blue-200/50 font-bold focus:outline-none focus:ring-2 focus:ring-[#ffc107]/50 focus:border-[#ffc107] transition-all"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleCheck}
                  size="lg"
                  className="bg-[#ffc107] hover:bg-[#e6ae06] text-[#052c65] font-black w-full rounded-2xl shadow-xl shadow-[#ffc107]/20 uppercase tracking-widest text-xs py-6"
                >
                  Verifikasi Sekarang
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#052c65] py-24 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://stikombanyuwangi.ac.id/assets/img/hero-bg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#052c65] via-[#052c65]/80 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Masa Depan Digital <br />
              <span className="text-[#ffc107]">Dimulai Di Sini</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Bergabunglah dengan <span className="font-bold">STIKOM PGRI Banyuwangi</span>. Kampus teknologi unggulan yang siap mencetak lulusan global kompetitif dan inovatif.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-[#ffc107] hover:bg-[#e6ae06] text-[#052c65] font-bold w-full md:w-auto text-lg px-8 shadow-lg">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/paths">
                <Button size="lg" variant="outline" className="text-blue-500 font-bold border-white hover:bg-white/10 w-full md:w-auto text-lg px-8">
                  Lihat Jalur Pendaftaran
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jalur Pendaftaran */}
      <section id="jalur" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#052c65] mb-4">Jalur Pendaftaran</h2>
            <div className="w-20 h-1.5 bg-[#ffc107] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden group">
              <div className="h-1.5 bg-[#ffc107] w-full" />
              <CardHeader>
                <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4 text-[#ffc107] group-hover:scale-110 transition-transform">
                  <BookOpen size={28} />
                </div>
                <CardTitle className="text-2xl text-[#052c65]">Jalur Reguler</CardTitle>
                <CardDescription>Pendaftaran melalui tes masuk standar.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">Terbuka untuk semua lulusan SMA/SMK/MA sederajat yang ingin bergabung di Gelombang 1, 2, atau 3.</p>
                <div className="flex items-center justify-between">
                  <Link href="/paths">
                    <Button variant="link" className="text-[#052c65] font-bold p-0 flex items-center gap-2 hover:text-[#ffc107] transition-all">
                      Selengkapnya
                    </Button>
                  </Link>
                  <Link href="/register?path=REGULER">
                    <Button variant="outline" className="border-[#052c65] text-[#052c65] hover:bg-[#052c65] hover:text-white font-bold px-4 py-2 rounded-lg transition-all">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden group">
              <div className="h-1.5 bg-[#052c65] w-full" />
              <CardHeader>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-[#052c65] group-hover:scale-110 transition-transform">
                  <Award size={28} />
                </div>
                <CardTitle className="text-2xl text-[#052c65]">Jalur Prestasi</CardTitle>
                <CardDescription>Bebas tes tulis bagi siswa berprestasi.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">Cukup gunakan nilai rapor atau sertifikat kejuaraan akademik/non-akademik minimal tingkat kabupaten.</p>
                <div className="flex items-center justify-between">
                  <Link href="/paths">
                    <Button variant="link" className="text-[#052c65] font-bold p-0 flex items-center gap-2 hover:text-[#ffc107] transition-all">
                      Selengkapnya
                    </Button>
                  </Link>
                  <Link href="/register?path=PRESTASI">
                    <Button variant="outline" className="border-[#052c65] text-[#052c65] hover:bg-[#052c65] hover:text-white font-bold px-4 py-2 rounded-lg transition-all">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden group">
              <div className="h-1.5 bg-[#ffc107] w-full" />
              <CardHeader>
                <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4 text-[#ffc107] group-hover:scale-110 transition-transform">
                  <GraduationCap size={28} />
                </div>
                <CardTitle className="text-2xl text-[#052c65]">Jalur Beasiswa</CardTitle>
                <CardDescription>Program KIP-Kuliah & Beasiswa Internal.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">Dapatkan kesempatan kuliah gratis atau keringanan biaya melalui berbagai program beasiswa unggulan kami.</p>
                <div className="flex items-center justify-between">
                  <Link href="/paths">
                    <Button variant="link" className="text-[#052c65] font-bold p-0 flex items-center gap-2 hover:text-[#ffc107] transition-all">
                      Selengkapnya
                    </Button>
                  </Link>
                  <Link href="/register?path=BEASISWA">
                    <Button variant="outline" className="border-[#052c65] text-[#052c65] hover:bg-[#052c65] hover:text-white font-bold px-4 py-2 rounded-lg transition-all">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Program Studi */}
      <section id="prodi" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#052c65] mb-4">Program Studi Unggulan</h2>
            <div className="w-20 h-1.5 bg-[#ffc107] mx-auto rounded-full" />
          </div>

          <ProgramSectionDynamic />

          <div className="mt-12 text-center">
            <Link href="/programs">
              <Button size="lg" className="bg-[#052c65] hover:bg-[#042452] text-white px-10 rounded-xl font-bold shadow-lg">
                Lihat Semua Program &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSectionDynamic />

      {/* Validation Check */}
      <ValidationSection />

      {/* Events Section */}
      <EventsSectionDynamic />

      {/* Footer */}
      <footer className="bg-[#052c65] text-slate-300 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h4 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-[#ffc107]">STIKOM</span> PGRI BANYUWANGI
            </h4>
            <p className="text-sm leading-relaxed max-w-md">
              Kampus Teknologi terakreditasi yang berlokasi strategis di pusat kota Banyuwangi, didedikasikan untuk membangun generasi melek teknologi yang berintegritas.
            </p>
            <p className="mt-4 text-sm flex items-start gap-2">
              <span className="text-[#ffc107] shrink-0 font-bold">ALAMAT:</span>
              Jalan Jenderal Ahmad Yani No. 80, Taman Baru, Kec. Banyuwangi, Jawa Timur 68416
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-6 border-l-4 border-[#ffc107] pl-3">Kontak Kami</h4>
            <ul className="text-sm space-y-3">
              <li className="flex items-center gap-2">Email: <a href="mailto:info@stikombanyuwangi.ac.id" className="hover:text-[#ffc107]">info@stikombanyuwangi.ac.id</a></li>
              <li className="flex items-center gap-2">WhatsApp: <a href="#" className="hover:text-[#ffc107]">0812-3456-7890</a></li>
              <li className="flex items-center gap-2">Tel: (0333) 417902</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-6 border-l-4 border-[#ffc107] pl-3">Tautan Penting</h4>
            <ul className="text-sm space-y-3">
              <li><Link href="#" className="hover:text-[#ffc107] transition-colors">Website Resmi</Link></li>
              <li><Link href="#" className="hover:text-[#ffc107] transition-colors">Portal Mahasiswa</Link></li>
              <li><Link href="#" className="hover:text-[#ffc107] transition-colors">Sistem E-Learning</Link></li>
              <li><Link href="#" className="hover:text-[#ffc107] transition-colors">Perpustakaan Digital</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} <span className="text-white font-semibold">STIKOM PGRI Banyuwangi</span>. Dikembangkan oleh Tim IT.
        </div>
      </footer>
    </div>
  );
}
