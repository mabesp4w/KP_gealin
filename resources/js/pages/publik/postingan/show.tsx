import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Badge, Button } from '@/components/ui';
import PublikLayout from '@/layouts/PublikLayout';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface User {
    id: number;
    name: string;
    email?: string;
}

type Kategori = 'berita' | 'kegiatan' | 'pengumuman' | 'berita_video' | 'artikel';

interface Postingan {
    id: number;
    judul: string;
    slug: string;
    isi: string | null;
    ringkasan: string | null;
    kategori: Kategori;
    gambar: string | null;
    video_url: string | null;
    published_at: string | null;
    user?: User | null;
    tanggal_kegiatan: string | null;
    lokasi: string | null;
}

interface RelatedPost {
    id: number;
    judul: string;
    slug: string;
    ringkasan: string | null;
    gambar: string | null;
    published_at: string | null;
    kategori: Kategori;
}

interface Props {
    post: Postingan;
    related: RelatedPost[];
}

function formatDateId(dateStr: string | null | undefined) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatDateTimeId(dateStr: string | null | undefined) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getKategoriColor(kategori: string): 'primary' | 'success' | 'warning' | 'info' | 'secondary' {
    const colors: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'secondary'> = {
        berita: 'primary',
        kegiatan: 'success',
        pengumuman: 'warning',
        berita_video: 'info',
        artikel: 'secondary',
    };
    return colors[kategori] || 'primary';
}

function getKategoriIcon(kategori: string): string {
    const icons: Record<string, string> = {
        berita: '📰',
        kegiatan: '📅',
        pengumuman: '📢',
        berita_video: '🎬',
        artikel: '📝',
    };
    return icons[kategori] || '📄';
}

function getKategoriLabel(kategori: string): string {
    const labels: Record<string, string> = {
        berita: 'Berita',
        kegiatan: 'Kegiatan',
        pengumuman: 'Pengumuman',
        berita_video: 'Berita Video',
        artikel: 'Artikel',
    };
    return labels[kategori] || kategori;
}

export default function PublikPostinganShow({ post, related }: Props) {
    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50,
        });
    }, []);

    // Parse konten HTML
    const kontenHtml = post.isi || '';

    // Extract YouTube video ID dari URL
    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    };

    return (
        <PublikLayout title={post.judul}>
            <Head title={post.judul} />

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <div data-aos="fade-down" className="flex items-center gap-2 text-sm text-base-content/60 mb-6">
                        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
                        <span>/</span>
                        <Link href={`/?kategori=${post.kategori}`} className="hover:text-primary transition-colors">
                            {getKategoriLabel(post.kategori)}
                        </Link>
                        <span>/</span>
                        <span className="truncate max-w-[200px]">{post.judul}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <article data-aos="fade-up" className="card bg-base-100 shadow-lg overflow-hidden">
                                {/* Featured Image / Video */}
                                {post.kategori === 'berita_video' && post.video_url ? (
                                    <div className="relative aspect-video bg-base-300">
                                        <iframe
                                            src={getYoutubeEmbedUrl(post.video_url) || ''}
                                            title={post.judul}
                                            className="absolute inset-0 w-full h-full"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                ) : post.gambar ? (
                                    <figure className="relative h-80 md:h-96 overflow-hidden">
                                        <img
                                            src={post.gambar.startsWith('/') ? post.gambar : `/storage/${post.gambar}`}
                                            alt={post.judul}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <Badge color={getKategoriColor(post.kategori)} size="lg" className="mb-3">
                                                {getKategoriIcon(post.kategori)} {getKategoriLabel(post.kategori)}
                                            </Badge>
                                        </div>
                                    </figure>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                        <span className="text-8xl opacity-50">{getKategoriIcon(post.kategori)}</span>
                                    </div>
                                )}

                                <div className="card-body p-6 md:p-8">
                                    {/* Title */}
                                    <h1 className="text-2xl md:text-3xl font-bold mb-4">
                                        {post.judul}
                                    </h1>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-base-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {post.user?.name?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{post.user?.name || 'Admin'}</p>
                                                <p className="text-xs text-base-content/60">Penulis</p>
                                            </div>
                                        </div>
                                        <div className="flex-1" />
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDateId(post.published_at)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kegiatan Info */}
                                    {(post.tanggal_kegiatan || post.lokasi) && (
                                        <div className="bg-base-200 rounded-lg p-4 mb-6">
                                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                <span>📅</span> Informasi Kegiatan
                                            </h3>
                                            <div className="space-y-2">
                                                {post.tanggal_kegiatan && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-base-content/60">Tanggal:</span>
                                                        <span className="font-medium">{formatDateTimeId(post.tanggal_kegiatan)}</span>
                                                    </div>
                                                )}
                                                {post.lokasi && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-base-content/60">Lokasi:</span>
                                                        <span className="font-medium">{post.lokasi}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <article
                                        className="prose prose-xl max-w-none prose-headings:text-base-content prose-p:text-base-content/80 prose-a:text-primary prose-img:rounded-lg"
                                        dangerouslySetInnerHTML={{ __html: kontenHtml }}
                                    />

                                    {/* Share */}
                                    <div className="mt-8 pt-6 border-t border-base-200">
                                        <h4 className="font-semibold mb-3">Bagikan:</h4>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="soft"
                                                onClick={() => navigator.clipboard.writeText(window.location.href)}
                                            >
                                                📋 Salin Link
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Back Button */}
                            <div data-aos="fade-left">
                                <Link href="/">
                                    <Button variant="outline" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Kembali ke Beranda
                                    </Button>
                                </Link>
                            </div>

                            {/* Related Posts */}
                            {related.length > 0 && (
                                <div data-aos="fade-left" data-aos-delay="100" className="card bg-base-100 shadow-lg">
                                    <div className="card-body">
                                        <h3 className="card-title text-lg mb-4">📰 Berita Terkait</h3>
                                        <div className="space-y-4">
                                            {related.map((item) => (
                                                <Link key={item.id} href={`/informasi/${item.slug}`} className="group block">
                                                    <div className="flex gap-3">
                                                        <div className="w-20 h-20 shrink-0 rounded-lg bg-base-200 overflow-hidden">
                                                            {item.gambar ? (
                                                                <img
                                                                    src={item.gambar.startsWith('/') ? item.gambar : `/storage/${item.gambar}`}
                                                                    alt={item.judul}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                                                    {getKategoriIcon(item.kategori)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                                                {item.judul}
                                                            </h4>
                                                            <p className="text-xs text-base-content/60 mt-1">{formatDateId(item.published_at)}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Categories */}
                            <div data-aos="fade-left" data-aos-delay="200" className="card bg-base-100 shadow-lg">
                                <div className="card-body">
                                    <h3 className="card-title text-lg mb-4">📂 Kategori</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['berita', 'kegiatan', 'pengumuman', 'artikel'].map((kat) => (
                                            <Link key={kat} href={`/?kategori=${kat}`}>
                                                <Badge
                                                    color={getKategoriColor(kat as Kategori)}
                                                    size="md"
                                                    className="cursor-pointer hover:opacity-80"
                                                >
                                                    {getKategoriIcon(kat)} {getKategoriLabel(kat)}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div data-aos="fade-left" data-aos-delay="300" className="card bg-primary text-primary-content shadow-lg">
                                <div className="card-body text-center">
                                    <div className="text-4xl mb-3">🏠</div>
                                    <h3 className="font-bold text-lg mb-2">Akses Layanan</h3>
                                    <p className="text-sm opacity-90 mb-4">
                                        Masuk untuk mengajukan surat administrasi secara online
                                    </p>
                                    <Link href="/login">

                                        Masuk Sekarang
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

        </PublikLayout>
    );
}
