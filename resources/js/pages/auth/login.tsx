import { Head, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { TextInput, PasswordInput, Button, Checkbox, Alert } from '@/components/ui';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />

            <div className="flex min-h-screen">
                {/* Left Side — Branding Panel */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary" />

                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
                                backgroundSize: '50px 50px',
                            }}
                        />
                    </div>

                    {/* Floating Shapes */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute bottom-32 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse [animation-delay:1s]" />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-2xl rotate-45 blur-lg animate-pulse [animation-delay:2s]" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center px-16 text-primary-content">
                        {/* Icon */}
                        <div className="mb-8">
                            <img src="/logo.svg" alt="Logo Kelurahan Ardipura" className="w-16 h-16" />
                        </div>

                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Aplikasi Kependudukan
                            <br />
                            <span className="text-white/80">Kelurahan Ardipura</span>
                        </h1>

                        <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
                            Sistem informasi pelayanan administrasi kependudukan yang terintegrasi
                            untuk mempermudah pengelolaan data penduduk dan layanan surat menyurat.
                        </p>

                        {/* Feature highlights */}
                        <div className="space-y-4">
                            {[
                                { icon: '📋', text: 'Pengelolaan data penduduk & Kartu Keluarga' },
                                { icon: '📄', text: 'Pembuatan & pengajuan surat online' },
                                { icon: '📊', text: 'Statistik & laporan kependudukan' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg shrink-0">
                                        {item.icon}
                                    </div>
                                    <span className="text-white/80 text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side — Login Form */}
                <div className="flex w-full lg:w-1/2 items-center justify-center bg-base-100 px-6 py-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-10">
                            <img src="/logo.svg" alt="Logo Kelurahan Ardipura" className="w-14 h-14 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-base-content">Kelurahan Ardipura</h2>
                            <p className="text-base-content/60 text-sm mt-1">Sistem Informasi Kependudukan</p>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-base-content">
                                Masuk ke akun Anda
                            </h2>
                            <p className="text-base-content/60 mt-2">
                                Silakan masukkan email dan password untuk melanjutkan
                            </p>
                        </div>

                        {/* Status Message (e.g., after password reset) */}
                        {status && (
                            <div className="mb-6">
                                <Alert color="success" variant="soft">
                                    {status}
                                </Alert>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
                            <TextInput
                                label="Email"
                                type="email"
                                placeholder="contoh@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                autoComplete="email"
                                autoFocus
                                required
                                id="login-email"
                            />

                            <PasswordInput
                                label="Password"
                                placeholder="Masukkan password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors.password}
                                autoComplete="current-password"
                                required
                                id="login-password"
                            />

                            {/* Remember Me */}
                            <Checkbox
                                label="Ingat saya"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                size="sm"
                                color="primary"
                                id="login-remember"
                            />

                            <Button
                                type="submit"
                                color="primary"
                                block
                                loading={processing}
                                className="mt-2"
                                id="login-submit"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-12 pt-6 border-t border-base-300 text-center">
                            <p className="text-xs text-base-content/40">
                                &copy; {new Date().getFullYear()} Kelurahan Ardipura — Kota Jayapura, Papua
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
