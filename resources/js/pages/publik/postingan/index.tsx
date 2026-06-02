import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { Badge } from '@/components/ui';
import PublikLayout from '@/layouts/PublikLayout';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface JenisSuratItem {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    persyaratan: string | null;
    bisa_diajukan_warga: boolean;
    urutan: number;
}

function formatPersyaratan(text: string | null): string[] {
    if (!text) return [];
    return text.split('\n').filter((line) => line.trim() !== '');
}

interface Props {
    jenisSurat: JenisSuratItem[];
    statsPenduduk: {
        laki: number;
        perempuan: number;
        total: number;
    };
}

export default function PublikPostinganIndex({
    jenisSurat,
    statsPenduduk,
}: Props) {
    useEffect(() => {
        AOS.init({ duration: 600, once: true, offset: 50 });
    }, []);

    return (
        <PublikLayout title="Informasi & Layanan">
            <Head title="Informasi & Layanan" />

            <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div data-aos="fade-up" className="text-center max-w-2xl mx-auto">
                        <div className="text-5xl mb-4">ℹ️</div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Informasi & Layanan</h1>
                        <p className="text-base-content/70">
                            Informasi, berita, dan layanan surat Kelurahan Ardipura
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistik Penduduk */}
            <section className="py-12 bg-base-100/50">
                <div className="max-w-6xl mx-auto px-4">
                    <div data-aos="fade-up" className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Data Penduduk</h2>
                        <p className="text-base-content/60 max-w-2xl mx-auto">
                            Informasi kependudukan Kelurahan Ardipura
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div data-aos="fade-up" className="card bg-base-100 shadow-lg border border-base-200">
                            <div className="card-body items-center text-center p-6">
                                <div className="text-4xl mb-2">👨</div>
                                <div className="text-3xl font-bold text-primary">{statsPenduduk.laki.toLocaleString('id-ID')}</div>
                                <div className="text-sm text-base-content/70">Laki-Laki</div>
                            </div>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="100" className="card bg-base-100 shadow-lg border border-base-200">
                            <div className="card-body items-center text-center p-6">
                                <div className="text-4xl mb-2">👩</div>
                                <div className="text-3xl font-bold text-secondary">{statsPenduduk.perempuan.toLocaleString('id-ID')}</div>
                                <div className="text-sm text-base-content/70">Perempuan</div>
                            </div>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="200" className="card bg-base-100 shadow-lg border border-base-200">
                            <div className="card-body items-center text-center p-6">
                                <div className="text-4xl mb-2">👥</div>
                                <div className="text-3xl font-bold text-accent">{statsPenduduk.total.toLocaleString('id-ID')}</div>
                                <div className="text-sm text-base-content/70">Total Jiwa</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layanan Surat */}
            {jenisSurat.length > 0 && (
                <section className="py-12 bg-base-100">
                    <div className="max-w-6xl mx-auto px-4">
                        <div data-aos="fade-up" className="text-center mb-10">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Layanan Surat</h2>
                            <p className="text-base-content/60 max-w-2xl mx-auto">
                                Jenis surat yang tersedia dan persyaratan yang harus dilengkapi
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {jenisSurat.map((js, index) => (
                                <div key={js.id} data-aos="fade-up" data-aos-delay={index * 50} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="card-body p-5">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div>
                                                <Badge color="primary" size="sm">{js.kode}</Badge>
                                                <h3 className="text-lg font-semibold mt-2">{js.nama}</h3>
                                            </div>
                                            {js.bisa_diajukan_warga && (
                                                <span className="badge badge-success badge-sm gap-1 shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Online
                                                </span>
                                            )}
                                        </div>

                                        {js.deskripsi && (
                                            <p className="text-sm text-base-content/60 mb-3">{js.deskripsi}</p>
                                        )}

                                        {js.persyaratan && (
                                            <div className="border-t border-base-200 pt-3 mt-1">
                                                <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">
                                                    Persyaratan:
                                                </p>
                                                <ul className="space-y-1.5">
                                                    {formatPersyaratan(js.persyaratan).map((line, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-base-content/70">
                                                            <span className="text-primary mt-0.5 shrink-0">•</span>
                                                            <span>{line}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </PublikLayout>
    );
}
