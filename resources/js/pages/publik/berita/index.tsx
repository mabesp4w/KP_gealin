import { Head, Link, router, usePage } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
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

interface PostinganItem {
    id: number;
    judul: string;
    slug: string;
    ringkasan: string | null;
    kategori: string;
    gambar: string | null;
    published_at: string | null;
    user?: User | null;
}

interface Props {
    postingan: LaravelPaginationData<PostinganItem>;
    filters: {
        search: string;
    };
    pageTitle?: string;
    pageIcon?: string;
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

export default function PublikBerita({ postingan, filters, pageTitle = 'Berita', pageIcon = '📰' }: Props) {
    const { name } = usePage().props;

    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50,
        });
    }, []);

    const [search, setSearch] = useState(filters.search ?? '');

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const doFilter = (nextSearch?: string) => {
        router.get(
            window.location.pathname,
            {
                search: (nextSearch ?? search).trim() || undefined,
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
            doFilter(value);
        }, 300);
    };

    return (
        <PublikLayout title={pageTitle}>
            <Head title={pageTitle} />

                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <div data-aos="fade-up" className="text-center max-w-2xl mx-auto">
                            <div className="text-5xl mb-4">{pageIcon}</div>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{pageTitle}</h1>
                            <p className="text-base-content/70">
                                Informasi terbaru seputar kegiatan dan perkembangan di Kelurahan Ardipura
                            </p>
                        </div>
                    </div>
                </section>

                {/* Search Bar */}
                <section className="py-6 bg-base-100 border-b border-base-200">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <p className="text-sm text-base-content/60">
                                Menampilkan {postingan.data.length} dari {postingan.total} {pageTitle.toLowerCase()}
                            </p>
                            <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder={`Cari ${pageTitle.toLowerCase()}...`}
                                    className="grow bg-transparent outline-none"
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                </section>

                {/* Grid Berita */}
                <section className="py-8">
                    <div className="max-w-6xl mx-auto px-4">
                        {postingan.data.length === 0 ? (
                            <div data-aos="fade-up" className="card bg-base-100 shadow-lg">
                                <div className="card-body text-center py-16">
                                    <div className="text-6xl mb-4">📭</div>
                                    <h3 className="text-xl font-semibold mb-2">Belum ada {pageTitle.toLowerCase()}</h3>
                                    <p className="text-base-content/60">{pageTitle} terbaru akan segera ditampilkan di sini.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {postingan.data.map((p, index) => (
                                    <div
                                        key={p.id}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                    >
                                        <Link href={`/informasi/${p.slug}`} className="group">
                                            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden">
                                                <figure className="relative h-48 overflow-hidden">
                                                    {p.gambar ? (
                                                        <img
                                                            src={p.gambar.startsWith('/') ? p.gambar : `/storage/${p.gambar}`}
                                                            alt={p.judul}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                                            <span className="text-5xl">📰</span>
                                                        </div>
                                                    )}
                                                </figure>
                                                
                                                <div className="card-body p-4">
                                                    <div className="flex items-center gap-2 text-xs text-base-content/50 mb-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDateId(p.published_at)}
                                                    </div>
                                                    
                                                    <h2 className="card-title line-clamp-2 text-base group-hover:text-primary transition-colors">
                                                        {p.judul}
                                                    </h2>
                                                    
                                                    {p.ringkasan && (
                                                        <p className="line-clamp-2 text-sm text-base-content/60 mt-2">
                                                            {p.ringkasan}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-200">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                                {p.user?.name?.charAt(0).toUpperCase() || 'A'}
                                                            </div>
                                                            <span className="text-xs text-base-content/60 truncate max-w-[80px]">
                                                                {p.user?.name || 'Admin'}
                                                            </span>
                                                        </div>
                                                        
                                                        <span className="text-xs font-medium text-primary group-hover:underline">
                                                            Baca Selengkapnya →
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        {postingan.data.length > 0 && (
                            <div className="mt-10 flex justify-center">
                                <LaravelPagination data={postingan} size="md" />
                            </div>
                        )}
                    </div>
                </section>

        </PublikLayout>
    );
}
