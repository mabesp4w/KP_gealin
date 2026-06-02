import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import PublikLayout from '@/layouts/PublikLayout';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function VisiMisi() {
    useEffect(() => {
        AOS.init({ duration: 600, once: true, offset: 50 });
    }, []);

    return (
        <PublikLayout title="Visi & Misi">
            <Head title="Visi & Misi" />

            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
                <div className="relative max-w-4xl mx-auto px-4 py-16">
                    <div data-aos="fade-up" className="text-center mb-12">
                        <div className="text-5xl mb-4">🎯</div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Visi & Misi</h1>
                        <p className="text-base-content/70 max-w-2xl mx-auto">
                            Kelurahan Ardipura — Kota Jayapura
                        </p>
                    </div>

                    <div data-aos="fade-up" className="card bg-base-100 shadow-lg mb-8">
                        <div className="card-body p-8">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <span className="text-3xl">👁️</span>
                                Visi
                            </h2>
                            <p className="text-lg leading-relaxed text-base-content/80 italic border-l-4 border-primary pl-4">
                                "Terwujudnya Kota Jayapura yang Beriman, Bersatu, Sejahtera, Mandiri, dan Modern berbasis Kearifan Lokal"
                            </p>
                        </div>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="100" className="card bg-base-100 shadow-lg">
                        <div className="card-body p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="text-3xl">📋</span>
                                Misi
                            </h2>
                            <ol className="space-y-4">
                                {[
                                    'Meningkatkan kualitas hidup umat beragama;',
                                    'Melanjutkan Penataan Kepemerintahan yang baik dengan dukungan kapasitas birokrasi yang profesional;',
                                    'Membangun Kota yang bersih, indah, aman, dan nyaman;',
                                    'Meningkatkan kualitas sumber daya masyarakat;',
                                    'Mengembangkan potensi ekonomi kota sebagai kota jasa dan perdagangan serta utilitas perkotaan berwawasan lingkungan;',
                                    'Meningkatkan kualitas hukum dan demokrasi;',
                                    'Memperkuat hak-hak adat dan memberdayakan masyarakat Kampung.',
                                ].map((misi, i) => (
                                    <li key={i} data-aos="fade-up" data-aos-delay={150 + i * 50} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold mt-0.5">
                                            {i + 1}
                                        </span>
                                        <span className="text-base-content/80">{misi}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="200" className="text-center mt-8">
                        <Link href="/" className="btn btn-outline">
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </section>
        </PublikLayout>
    );
}
