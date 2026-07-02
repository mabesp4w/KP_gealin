import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useRef, useState, useEffect } from 'react';
import { LaravelPagination, Badge, Button } from '@/components/ui';
import PublikLayout from '@/layouts/PublikLayout';
import AOS from 'aos';
import 'aos/dist/aos.css';

type LaravelLink = { url: string | null; label: string; active: boolean };

type LaravelPaginationData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: LaravelLink[];
};

interface User {
    id: number;
    name: string;
    email?: string;
}

type Kategori = string;

interface PostinganItem {
    id: number;
    judul: string;
    slug: string;
    ringkasan: string | null;
    kategori: Kategori;
    gambar: string | null;
    published_at: string | null;
    user?: User | null;
}

interface Props {
    postingan: LaravelPaginationData<PostinganItem>;
    filters: {
        search: string;
        kategori: string;
    };
    kategoriList: { value: Kategori; label: string }[] | Kategori[] | null;
    stats: {
        penduduk: number;
        jenis_surat: number;
    };
}

function formatDateId(dateStr: string | null | undefined) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function AutoCarousel({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);
    const len = images.length;

    useEffect(() => {
        const timer = setInterval(() => setCurrent((p) => (p + 1) % len), 4000);
        return () => clearInterval(timer);
    }, [len]);

    return (
        <div className="relative w-full rounded-2xl shadow-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {images.map((src, i) => (
                <img
                    key={src}
                    src={src}
                    alt={`Kantor Kelurahan Ardipura ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    style={{ opacity: i === current ? 1 : 0 }}
                />
            ))}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
}

function StatCard({ number, label, icon }: { number: string; label: string; icon: string }) {
    return (
        <div
            data-aos="fade-up"
            className="card bg-base-100 shadow-lg"
        >
            <div className="card-body items-center text-center p-6">
                <div className="text-4xl mb-2">{icon}</div>
                <div className="text-3xl font-bold text-primary">{number}</div>
                <div className="text-sm text-base-content/70">{label}</div>
            </div>
        </div>
    );
}

export default function PublikDashboard({
    postingan,
    filters,
    kategoriList,
    stats,
}: Props) {
    const { name } = usePage().props;

    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50,
        });
    }, []);

    const [search, setSearch] = useState(filters.search ?? '');
    const [kategori, setKategori] = useState(filters.kategori ?? '');

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const kategoriOptions = useMemo(() => {
        if (!kategoriList) return [] as { value: Kategori; label: string }[];
        if (kategoriList.length === 0)
            return [] as { value: Kategori; label: string }[];

        const first = kategoriList[0];

        if (
            first &&
            typeof first === 'object' &&
            !Array.isArray(first) &&
            'value' in first &&
            'label' in first
        ) {
            return kategoriList as { value: Kategori; label: string }[];
        }

        if (typeof first === 'string') {
            return (kategoriList as string[]).map((k) => ({
                value: k,
                label: k,
            }));
        }

        return [] as { value: Kategori; label: string }[];
    }, [kategoriList]);

    const doFilter = (nextSearch?: string, nextKategori?: string) => {
        router.get(
            '/',
            {
                search: (nextSearch ?? search).trim() || undefined,
                kategori: (nextKategori ?? kategori).trim() || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            doFilter(value, kategori);
        }, 300);
    };

    const handleKategoriChange = (value: string) => {
        setKategori(value);
        doFilter(search, value);
    };

    return (
        <PublikLayout title="Beranda">
            <Head title="Beranda" />

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div
                                data-aos="fade-up"
                                data-aos-duration="800"
                            >
                                <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {name}
                                    </span>
                                </h1>
                                <p className="text-lg sm:text-xl text-base-content/70 mb-8 leading-relaxed">
                                    Aplikasi kependudukan berbasis web untuk Kelurahan Ardipura.
                                    Akses informasi kependudukan, layanan surat, dan berita terkini
                                    dalam satu platform terintegrasi.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/login" className="btn btn-primary btn-lg shadow-lg shadow-primary/25">
                                        Mulai Sekarang
                                    </Link>
                                    <Link href="/#informasi" className="btn btn-outline btn-lg">
                                        Lihat Informasi
                                    </Link>
                                </div>
                            </div>
                            <div
                                data-aos="fade-up"
                                data-aos-duration="800"
                                data-aos-delay="200"
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl" />
                                <AutoCarousel images={['/images/kantor1.jpeg', '/images/kantor2.jpeg']} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-base-100">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard number={stats.penduduk.toLocaleString('id-ID') + '+'} label="Penduduk Terdaftar" icon="👥" />
                            <StatCard number={stats.jenis_surat + '+'} label="Layanan Surat" icon="📋" />
                            <StatCard number="24/7" label="Akses Online" icon="🌐" />
                            <StatCard number="100%" label="Gratis" icon="✨" />
                        </div>
                    </div>
                </section>

                {/* Informasi Section */}
                <section id="informasi" className="py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <div
                            data-aos="fade-up"
                            className="text-center mb-10"
                        >
                            <h2 className="text-3xl font-bold mb-3">Informasi Terkini</h2>
                            <p className="text-base-content/70 max-w-2xl mx-auto">
                                Berita, kegiatan, pengumuman, dan artikel terbaru dari Kelurahan Ardipura
                            </p>
                        </div>

                        {/* Toolbar */}
                        <div
                            data-aos="fade-up"
                            data-aos-delay="100"
                            className="card bg-base-100 shadow-lg mb-8"
                        >
                            <div className="card-body p-4">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleKategoriChange('')}
                                            className={`btn btn-sm ${kategori === '' ? 'btn-primary' : 'btn-ghost'}`}
                                        >
                                            Semua
                                        </button>
                                        {kategoriOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleKategoriChange(opt.value)}
                                                className={`btn btn-sm ${kategori === opt.value ? 'btn-primary' : 'btn-ghost'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    <label className="input input-bordered flex items-center gap-2 max-w-xs">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari informasi..."
                                            className="grow bg-transparent outline-none"
                                            value={search}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div>
                            {postingan.data.length === 0 ? (
                                <div className="card bg-base-100 shadow-lg">
                                    <div className="card-body text-center py-16">
                                        <div className="text-6xl mb-4">📭</div>
                                        <h3 className="text-xl font-semibold mb-2">Belum ada postingan</h3>
                                        <p className="text-base-content/60">Informasi terbaru akan segera ditampilkan di sini.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {postingan.data.map((p, index) => (
                                        <div
                                            key={p.id}
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                                                <figure className="relative h-48 overflow-hidden">
                                                    {p.gambar ? (
                                                        <img
                                                            src={p.gambar.startsWith('/') ? p.gambar : `/storage/${p.gambar}`}
                                                            alt={p.judul}
                                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                                            <span className="text-6xl opacity-50">📰</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 left-4">
                                                        <Badge color="primary" size="sm" className="shadow-lg">
                                                            {p.kategori}
                                                        </Badge>
                                                    </div>
                                                </figure>
                                                <div className="card-body flex flex-col">
                                                    <div className="flex items-center gap-2 text-xs text-base-content/50 mb-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDateId(p.published_at)}
                                                    </div>
                                                    <h2 className="card-title line-clamp-2 text-lg mb-2 hover:text-primary transition-colors">
                                                        <Link href={`/informasi/${p.slug}`}>
                                                            {p.judul}
                                                        </Link>
                                                    </h2>
                                                    {p.ringkasan && (
                                                        <p className="line-clamp-3 text-sm text-base-content/60 mb-4 flex-grow">
                                                            {p.ringkasan}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between pt-4 border-t border-base-200">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                                                                {p.user?.name?.charAt(0).toUpperCase() || 'A'}
                                                            </div>
                                                            <span className="text-xs text-base-content/60 truncate max-w-[100px]">
                                                                {p.user?.name || 'Admin'}
                                                            </span>
                                                        </div>
                                                        <Link href={`/informasi/${p.slug}`}>
                                                            <Button size="sm" variant="soft" color="primary">
                                                                Baca
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {postingan.data.length > 0 && (
                            <div className="mt-10 flex justify-center">
                                <LaravelPagination data={postingan} size="md" />
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-primary text-primary-content">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <div
                            data-aos="zoom-in"
                            data-aos-duration="600"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Siap Mempermudah Layanan Administrasi?
                            </h2>
                            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                                Akses layanan dan ajukan surat administrasi
                                kependudukan secara online tanpa perlu antre di kantor kelurahan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/login" className="btn btn-secondary btn-lg">

                                    Masuk Sekarang
                                </Link>
                                <Link href="/login" className="btn btn-outline btn-lg border-white/30 text-white hover:bg-white/10">
                                    Sudah Punya Akun?
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

        </PublikLayout>
    );
}
