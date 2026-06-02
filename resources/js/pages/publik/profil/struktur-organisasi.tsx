import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import PublikLayout from '@/layouts/PublikLayout';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function StrukturOrganisasi() {
    useEffect(() => {
        AOS.init({ duration: 600, once: true, offset: 50 });
    }, []);

    return (
        <PublikLayout title="Struktur Organisasi">
            <Head title="Struktur Organisasi" />

            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
                <div className="relative max-w-5xl mx-auto px-4 py-16">
                    <div data-aos="fade-up" className="text-center mb-12">
                        <div className="text-5xl mb-4">🏛️</div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Struktur Organisasi</h1>
                        <p className="text-base-content/70 max-w-2xl mx-auto">
                            Struktur organisasi Pemerintahan Kelurahan Ardipura
                        </p>
                    </div>

                    <div data-aos="fade-up" className="card bg-base-100 shadow-lg">
                        <div className="card-body p-8">
                            <div className="text-center text-base-content/60 py-8">
                                <div className="text-6xl mb-4">📊</div>
                                <p className="text-lg">Struktur organisasi akan segera ditampilkan.</p>
                                <p className="text-sm mt-2">Silakan hubungi kelurahan untuk informasi lebih lanjut.</p>
                            </div>
                        </div>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="100" className="text-center mt-8">
                        <Link href="/" className="btn btn-outline">
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </section>
        </PublikLayout>
    );
}
