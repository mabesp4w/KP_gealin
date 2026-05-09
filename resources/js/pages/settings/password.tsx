import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { PasswordInput, Button, showError } from '@/components/ui';

interface PasswordProps extends PageProps {
    session?: { status?: string };
}

export default function Password({ session }: PasswordProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/password', {
            onError: () => {
                showError('Gagal memperbarui password.');
            },
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Password Settings" />
            <div className="min-h-screen bg-base-200/50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-2">Password</h2>
                            <p className="text-base-content/60 mb-6">
                                Pastikan password Anda kuat dan aman.
                            </p>

                            {session?.status && (
                                <div className="alert alert-success mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{session.status}</span>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <PasswordInput
                                    label="Password Saat Ini"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    error={errors.current_password}
                                    required
                                />

                                <PasswordInput
                                    label="Password Baru"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    required
                                />

                                <PasswordInput
                                    label="Konfirmasi Password Baru"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                    required
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        loading={processing}
                                    >
                                        Simpan Password
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
