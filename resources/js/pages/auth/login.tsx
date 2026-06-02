import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Props {
    status?: string;
}

export default function Login({ status }: Props) {
    const { name } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
        });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Masuk" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
                <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Left Side - Illustration */}
                    <div 
                        className="lg:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 lg:p-12 flex flex-col justify-center items-center text-primary-content relative"
                        data-aos="fade-right"
                    >
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white" />
                            <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-white" />
                            <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white" />
                        </div>
                        
                        <div className="relative z-10 text-center">
                            <div className="text-6xl mb-6">🏛️</div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{name}</h1>
                            <p className="text-lg opacity-90 mb-2">Sistem Informasi Kependudukan</p>
                            <p className="text-sm opacity-75">Kelurahan Ardipura</p>
                            
                            <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                <p className="text-sm opacity-90">
                                    "Akses layanan administrasi kependudukan dengan mudah dan cepat"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div 
                        className="lg:w-1/2 p-8 lg:p-12"
                        data-aos="fade-left"
                    >
                        <div className="max-w-sm mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali</h2>
                                <p className="text-base-content/60">Silakan masuk ke akun Anda</p>
                            </div>

                            {status && (
                                <div className="alert alert-success mb-6">
                                    <span>{status}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                                        placeholder="nama@email.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-error text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">Password</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                                            placeholder="••••••••"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m8.21 8.21l3.59 3.59" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-error text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary checkbox-sm"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="text-sm">Ingat saya</span>
                                    </label>
                                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                        Lupa password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Memuat...
                                        </>
                                    ) : (
                                        'Masuk'
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href="/" className="text-sm text-base-content/50 hover:text-primary transition-colors">
                                    ← Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
