import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { TextInput, Button, showError } from '@/components/ui';

interface ProfileProps extends PageProps {
    session?: { status?: string };
}

export default function Profile({ session }: ProfileProps) {
    const user = usePage<ProfileProps>().props.auth?.user;

    const { data, setData, patch, processing, errors, delete: destroy } = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/profile', {
            onError: () => {
                showError('Gagal memperbarui profil.');
            },
        });
    };

    const deleteAccount = () => {
        if (!confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
            return;
        }

        destroy('/settings/profile');
    };

    return (
        <>
            <Head title="Profile Settings" />
            <div className="min-h-screen bg-base-200/50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-6">Profil</h2>

                            {session?.status && (
                                <div className="alert alert-success mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{session.status}</span>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <TextInput
                                    label="Nama"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    required
                                />

                                <TextInput
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    required
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        loading={processing}
                                    >
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </form>

                            <div className="divider"></div>

                            <h3 className="text-lg font-semibold text-error">Hapus Akun</h3>
                            <p className="text-sm text-base-content/60 mb-4">
                                Setelah akun dihapus, semua data dan resource akan dihapus secara permanen.
                            </p>
                            <Button
                                type="button"
                                color="error"
                                variant="outline"
                                onClick={deleteAccount}
                            >
                                Hapus Akun
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
