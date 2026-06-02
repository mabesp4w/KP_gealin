import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import PublikLayout from '@/layouts/PublikLayout';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LAT = -2.5548954188041035;
const LNG = 140.7034676573835;

export default function Peta() {
    useEffect(() => {
        AOS.init({ duration: 600, once: true, offset: 50 });
    }, []);

    return (
        <PublikLayout title="Peta">
            <Head title="Peta" />

            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
                <div className="relative max-w-5xl mx-auto px-4 py-16">
                    <div data-aos="fade-up" className="text-center mb-12">
                        <div className="text-5xl mb-4">🗺️</div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Peta</h1>
                        <p className="text-base-content/70 max-w-2xl mx-auto">
                            Peta lokasi dan wilayah Kelurahan Ardipura
                        </p>
                    </div>

                    <div data-aos="fade-up" className="w-full rounded-xl overflow-hidden shadow-lg border border-base-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5000!2d140.7027274!3d-2.5555278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x686c58f5a83b40fb%3A0xe0b55445345c931b!2sKantor+Kelurahan+Ardipura!5e1!3m2!1sid!2sid!4v1"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Kantor Kelurahan Ardipura"
                        />
                    </div>
                    <div data-aos="fade-up" data-aos-delay="100" className="mt-3 text-center text-sm text-base-content/60 flex items-center justify-center gap-4">
                        <span className="flex items-center gap-1">
                            <span className="font-medium">Lat:</span> {LAT}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="font-medium">Lng:</span> {LNG}
                        </span>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="150" className="text-center mt-8">
                        <Link href="/" className="btn btn-outline">
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </section>
        </PublikLayout>
    );
}
