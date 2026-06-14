import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PageProps } from '@/types';
import StafLayout from '@/layouts/StafLayout';
import {
    Button,
    TextInput,
    Textarea,
    Card,
    CardBody,
    CardTitle,
    showError,
    showSuccess,
} from '@/components/ui';

interface KelurahanData {
    id?: number;
    nama_kelurahan: string;
    alamat: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    kota: string | null;
    provinsi: string | null;
    kode_pos: string | null;
    telepon: string | null;
    email: string | null;
    website: string | null;
    nama_lurah: string | null;
    nip_lurah: string | null;
    jabatan_lurah: string | null;
    logo: string | null;
    tanda_tangan: string | null;
}

interface KelurahanProps extends PageProps {
    kelurahan: KelurahanData;
}

export default function KelurahanSettings({ kelurahan }: KelurahanProps) {
    const [form, setForm] = useState<KelurahanData>({ ...kelurahan });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [ttdFile, setTtdFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [ttdPreview, setTtdPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const flash = (usePage().props as any).flash as { success?: string; error?: string } | undefined;

    useEffect(() => {
        if (flash?.success) showSuccess(flash.success);
        if (flash?.error) showError(flash.error);
    }, [flash]);

    const handleChange = (field: keyof KelurahanData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleTtdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTtdFile(file);
            setTtdPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('nama_kelurahan', form.nama_kelurahan);
        if (form.alamat) data.append('alamat', form.alamat);
        if (form.kelurahan) data.append('kelurahan', form.kelurahan);
        if (form.kecamatan) data.append('kecamatan', form.kecamatan);
        if (form.kota) data.append('kota', form.kota);
        if (form.provinsi) data.append('provinsi', form.provinsi);
        if (form.kode_pos) data.append('kode_pos', form.kode_pos);
        if (form.telepon) data.append('telepon', form.telepon);
        if (form.email) data.append('email', form.email);
        if (form.website) data.append('website', form.website);
        if (form.nama_lurah) data.append('nama_lurah', form.nama_lurah);
        if (form.nip_lurah) data.append('nip_lurah', form.nip_lurah);
        if (form.jabatan_lurah) data.append('jabatan_lurah', form.jabatan_lurah);
        if (logoFile) data.append('logo', logoFile);
        if (ttdFile) data.append('tanda_tangan', ttdFile);

        router.post('/staf/settings/kelurahan', data, {
            preserveScroll: true,
            onError: (errors) => {
                const first = Object.values(errors)[0];
                showError(typeof first === 'string' ? first : 'Gagal menyimpan data.');
            },
            onSuccess: () => {
                setLogoFile(null);
                setTtdFile(null);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const logoUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `/storage/${path}`;
    };

    return (
        <StafLayout title="Data Kelurahan">
            <Head title="Data Kelurahan" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-base-content">Data Kelurahan</h2>
                        <p className="text-base-content/60 mt-1">
                            Kelola profil kelurahan, logo, dan tanda tangan lurah untuk surat resmi
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Identitas Kelurahan */}
                        <Card variant="bordered" className="mb-6">
                            <CardBody>
                                <CardTitle className="text-lg mb-4">Identitas Kelurahan</CardTitle>
                                <div className="space-y-4">
                                    <TextInput
                                        label="Nama Kelurahan"
                                        value={form.nama_kelurahan}
                                        onChange={(v) => handleChange('nama_kelurahan', v)}
                                        required
                                    />
                                    <Textarea
                                        label="Alamat"
                                        value={form.alamat ?? ''}
                                        onChange={(v) => handleChange('alamat', v)}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <TextInput
                                            label="Kelurahan"
                                            value={form.kelurahan ?? ''}
                                            onChange={(v) => handleChange('kelurahan', v)}
                                        />
                                        <TextInput
                                            label="Kecamatan"
                                            value={form.kecamatan ?? ''}
                                            onChange={(v) => handleChange('kecamatan', v)}
                                        />
                                        <TextInput
                                            label="Kota"
                                            value={form.kota ?? ''}
                                            onChange={(v) => handleChange('kota', v)}
                                        />
                                        <TextInput
                                            label="Provinsi"
                                            value={form.provinsi ?? ''}
                                            onChange={(v) => handleChange('provinsi', v)}
                                        />
                                        <TextInput
                                            label="Kode Pos"
                                            value={form.kode_pos ?? ''}
                                            onChange={(v) => handleChange('kode_pos', v)}
                                        />
                                        <TextInput
                                            label="Telepon"
                                            value={form.telepon ?? ''}
                                            onChange={(v) => handleChange('telepon', v)}
                                        />
                                        <TextInput
                                            label="Email"
                                            type="email"
                                            value={form.email ?? ''}
                                            onChange={(v) => handleChange('email', v)}
                                        />
                                        <TextInput
                                            label="Website"
                                            value={form.website ?? ''}
                                            onChange={(v) => handleChange('website', v)}
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Data Lurah */}
                        <Card variant="bordered" className="mb-6">
                            <CardBody>
                                <CardTitle className="text-lg mb-4">Data Lurah</CardTitle>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <TextInput
                                        label="Nama Lurah"
                                        value={form.nama_lurah ?? ''}
                                        onChange={(v) => handleChange('nama_lurah', v)}
                                    />
                                    <TextInput
                                        label="NIP Lurah"
                                        value={form.nip_lurah ?? ''}
                                        onChange={(v) => handleChange('nip_lurah', v)}
                                    />
                                    <TextInput
                                        label="Jabatan Lurah"
                                        value={form.jabatan_lurah ?? ''}
                                        onChange={(v) => handleChange('jabatan_lurah', v)}
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Logo & Tanda Tangan */}
                        <Card variant="bordered" className="mb-6">
                            <CardBody>
                                <CardTitle className="text-lg mb-4">Logo & Tanda Tangan</CardTitle>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Logo */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Logo Kelurahan</span>
                                        </label>
                                        {(logoPreview || kelurahan.logo) && (
                                            <img
                                                src={logoPreview ?? logoUrl(kelurahan.logo) ?? ''}
                                                alt="Logo"
                                                className="w-32 h-32 object-contain mb-3 border rounded-lg p-2"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg"
                                            onChange={handleLogoChange}
                                            className="file-input file-input-bordered w-full"
                                        />
                                        <p className="text-xs text-base-content/50 mt-1">PNG/JPG, maks 2MB</p>
                                    </div>

                                    {/* Tanda Tangan */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Tanda Tangan Lurah</span>
                                        </label>
                                        {(ttdPreview || kelurahan.tanda_tangan) && (
                                            <img
                                                src={ttdPreview ?? logoUrl(kelurahan.tanda_tangan) ?? ''}
                                                alt="Tanda Tangan"
                                                className="w-48 h-20 object-contain mb-3 border rounded-lg p-2"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg"
                                            onChange={handleTtdChange}
                                            className="file-input file-input-bordered w-full"
                                        />
                                        <p className="text-xs text-base-content/50 mt-1">PNG/JPG, maks 1MB, background transparan</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" color="primary" loading={isSubmitting}>
                                Simpan Data Kelurahan
                            </Button>
                        </div>
                    </form>
                </div>
        </StafLayout>
    );
}
