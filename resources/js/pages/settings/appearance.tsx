import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useAppearance } from '@/hooks/use-appearance';
import { Card, CardBody, CardTitle } from '@/components/ui';

interface AppearanceProps extends PageProps {}

export default function Appearance({}: AppearanceProps) {
    const { appearance, setAppearance } = useAppearance();

    return (
        <>
            <Head title="Appearance Settings" />
            <div className="min-h-screen bg-base-200/50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-base-content">Tampilan</h2>
                        <p className="text-base-content/60 mt-1">
                            Sesuaikan tampilan aplikasi sesuai preferensi Anda
                        </p>
                    </div>

                    <Card variant="bordered">
                        <CardBody>
                            <CardTitle className="text-lg mb-4">Mode Tema</CardTitle>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setAppearance('light')}
                                    className={`btn btn-outline justify-start h-auto py-4 ${
                                        appearance === 'light' ? 'btn-active' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 to-white border border-base-300"></div>
                                        <div className="text-left">
                                            <div className="font-medium">Terang</div>
                                            <div className="text-xs opacity-60">Light mode</div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setAppearance('dark')}
                                    className={`btn btn-outline justify-start h-auto py-4 ${
                                        appearance === 'dark' ? 'btn-active' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-base-300"></div>
                                        <div className="text-left">
                                            <div className="font-medium">Gelap</div>
                                            <div className="text-xs opacity-60">Dark mode</div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setAppearance('system')}
                                    className={`btn btn-outline justify-start h-auto py-4 ${
                                        appearance === 'system' ? 'btn-active' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-800 border border-base-300"></div>
                                        <div className="text-left">
                                            <div className="font-medium">Sistem</div>
                                            <div className="text-xs opacity-60">Ikuti sistem</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </CardBody>
                    </Card>

                    <Card variant="bordered" className="mt-6">
                        <CardBody>
                            <CardTitle className="text-lg mb-2">Tentang Tema</CardTitle>
                            <div className="text-sm text-base-content/70 space-y-2">
                                <p>Aplikasi menggunakan dua tema dari daisyUI:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li><strong>Emerald</strong> - Tema terang dengan nuansa hijau</li>
                                    <li><strong>Forest</strong> - Tema gelap dengan nuansa alam</li>
                                </ul>
                                <p className="mt-2">
                            Mode "Sistem" akan otomatis mengikuti pengaturan tema operasi sistem Anda.
                        </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}
