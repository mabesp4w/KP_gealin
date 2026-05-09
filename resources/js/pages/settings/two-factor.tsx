import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardBody, CardTitle, Button } from '@/components/ui';

interface TwoFactorProps extends PageProps {
    twoFactorEnabled: boolean;
    requiresConfirmation: boolean;
}

export default function TwoFactor({ twoFactorEnabled }: TwoFactorProps) {
    const { props } = usePage<TwoFactorProps>();

    return (
        <>
            <Head title="Two-Factor Authentication" />
            <div className="min-h-screen bg-base-200/50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-base-content">Autentikasi Dua Faktor</h2>
                        <p className="text-base-content/60 mt-1">
                            Tambahkan keamanan ekstra ke akun Anda
                        </p>
                    </div>

                    <Card variant="bordered">
                        <CardBody>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg mb-2">
                                        {twoFactorEnabled ? '2FA Aktif' : '2FA Nonaktif'}
                                    </CardTitle>
                                    <p className="text-sm text-base-content/70 mb-4">
                                        {twoFactorEnabled
                                            ? 'Autentikasi dua faktor telah diaktifkan untuk akun Anda.'
                                            : 'Aktifkan autentikasi dua faktor untuk keamanan tambahan.'}
                                    </p>

                                    {!twoFactorEnabled ? (
                                        <a
                                            href="/user/two-factor-authentication"
                                            className="btn btn-primary btn-sm"
                                        >
                                            Aktifkan 2FA
                                        </a>
                                    ) : (
                                        <div className="space-y-3">
                                            <a
                                                href="/user/two-factor-qr-code"
                                                className="btn btn-outline btn-sm"
                                            >
                                                Lihat QR Code
                                            </a>
                                            <a
                                                href="/user/two-factor-recovery-codes"
                                                className="btn btn-outline btn-sm ml-2"
                                            >
                                                Recovery Codes
                                            </a>
                                            <form
                                                method="POST"
                                                action="/user/two-factor-authentication"
                                                className="inline"
                                            >
                                                <input type="hidden" name="_method" value="DELETE" />
                                                <button
                                                    type="submit"
                                                    className="btn btn-error btn-outline btn-sm ml-2"
                                                    onClick={(e) => {
                                                        if (!confirm('Nonaktifkan 2FA? Akun akan menjadi kurang aman.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Nonaktifkan 2FA
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card variant="bordered" className="mt-6">
                        <CardBody>
                            <CardTitle className="text-base mb-2">Bagaimana 2FA bekerja?</CardTitle>
                            <div className="text-sm text-base-content/70 space-y-2">
                                <p>Autentikasi dua faktor (2FA) menambahkan lapisan keamanan ekstra:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-2">
                                    <li>Masukkan password seperti biasa</li>
                                    <li>Masukkan kode dari aplikasi authenticator (Google Authenticator, Authy, dll)</li>
                                </ol>
                                <p className="mt-2">
                            Tanpa kode 6 digit ini, orang lain tidak dapat mengakses akun Anda meskipun mengetahui password.
                        </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}
