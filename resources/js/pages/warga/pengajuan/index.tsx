import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import WargaLayout from '@/layouts/WargaLayout';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { Button, Textarea, showError, SelectInput, Alert } from '@/components/ui';
import { schema, defaultValues, type FormValues } from './schema';
import { useState, useCallback } from 'react';

interface PersyaratanSurat {
    id: number;
    nama: string;
    tipe_file: string;
    wajib: boolean;
    keterangan: string | null;
}

interface JenisSurat {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    persyaratan: PersyaratanSurat[];
}

interface WargaPengajuanProps extends PageProps {
    jenisSurat: JenisSurat[];
    penduduk: {
        id: number;
        nama_lengkap: string;
    } | null;
}

const jenisSuratOptions = (jenisSurat: JenisSurat[]) =>
    jenisSurat.map((js) => ({ value: String(js.id), label: js.nama }));

const tipeFileLabels: Record<string, string> = {
    image: 'Gambar (JPG, PNG)',
    pdf: 'Dokumen PDF',
    document: 'Dokumen',
};

export default function WargaPengajuan({ jenisSurat, penduduk }: WargaPengajuanProps) {
    const [selectedJenisSuratId, setSelectedJenisSuratId] = useState<number | null>(null);
    const [lampiran, setLampiran] = useState<Record<number, File>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const selectedJenisSurat = jenisSurat.find((js) => js.id === selectedJenisSuratId);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues,
    });

    // Filter jenis surat berdasarkan search
    const filteredJenisSurat = jenisSurat.filter((js) =>
        js.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        js.persyaratan?.some((p) => p.nama.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleFileChange = (persyaratanId: number, file: File | null) => {
        if (file) {
            setLampiran((prev) => ({ ...prev, [persyaratanId]: file }));
        } else {
            setLampiran((prev) => {
                const { [persyaratanId]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const onSubmit = (values: FormValues) => {
        if (!penduduk) {
            showError('Data penduduk belum terhubung. Silakan hubungi admin kelurahan.');
            return;
        }

        // Check if all required persyaratan are uploaded
        if (selectedJenisSurat?.persyaratan && selectedJenisSurat.persyaratan.length > 0) {
            const requiredPersyaratan = selectedJenisSurat.persyaratan.filter((p) => p.wajib);
            const missingPersyaratan = requiredPersyaratan.filter((p) => !lampiran[p.id]);

            if (missingPersyaratan.length > 0) {
                showError(`Mohon upload persyaratan: ${missingPersyaratan.map((p) => p.nama).join(', ')}`);
                return;
            }
        }

        // Create FormData for file uploads
        const formData = new FormData();
        formData.append('jenis_surat_id', String(values.jenis_surat_id));
        formData.append('keperluan', values.keperluan);
        if (values.keterangan) {
            formData.append('keterangan', values.keterangan);
        }
        formData.append('penduduk_id', String(penduduk.id));

        // Add lampiran files
        Object.entries(lampiran).forEach(([persyaratanId, file]) => {
            formData.append(`lampiran[${persyaratanId}]`, file);
            formData.append(`persyaratan_ids[]`, persyaratanId);
        });

        router.post('/warga/pengajuan', formData, {
            onError: (serverErrors) => {
                Object.entries(serverErrors).forEach(([field, msg]) => {
                    setError(field as keyof FormValues, { type: 'server', message: msg as string });
                });
                showError(Object.values(serverErrors)[0] as string || 'Gagal menyimpan pengajuan.');
            },
            onSuccess: () => {
                router.visit('/warga');
            },
        });
    };

    return (
        <>
            <Head title="Pengajuan Surat" />
            <WargaLayout title="Pengajuan Surat">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-base-content">Pengajuan Surat</h1>
                        <p className="text-base-content/60 mt-1">
                            Ajukan permohonan surat secara online
                        </p>
                    </div>

                    {!penduduk ? (
                        <div className="alert alert-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <h3 className="font-bold">Data Tidak Tersedia</h3>
                                <div className="text-xs">Data kependudukan Anda belum terhubung. Silakan hubungi admin kelurahan untuk verifikasi data.</div>
                            </div>
                        </div>
                    ) : (
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Jenis Surat */}
                                    <Controller
                                        name="jenis_surat_id"
                                        control={control}
                                        render={({ field }) => (
                                            <SelectInput
                                                label="Jenis Surat"
                                                placeholder="Pilih jenis surat"
                                                options={jenisSuratOptions(jenisSurat)}
                                                value={jenisSuratOptions(jenisSurat).find((o) => o.value === String(field.value))}
                                                onChange={(option) => {
                                                    field.onChange(option ? Number(option.value) : 0);
                                                    setSelectedJenisSuratId(option ? Number(option.value) : null);
                                                    setLampiran({});
                                                }}
                                                error={errors.jenis_surat_id?.message}
                                                isClearable
                                                menuPlacement="bottom"
                                            />
                                        )}
                                    />

                                    {/* Upload Lampiran - muncul setelah pilih jenis surat */}
                                    {selectedJenisSurat && selectedJenisSurat.persyaratan && selectedJenisSurat.persyaratan.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 pb-2 border-b border-base-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <h4 className="font-semibold text-base-content">Dokumen Persyaratan</h4>
                                                <span className="badge badge-sm badge-ghost ml-auto">
                                                    {selectedJenisSurat.persyaratan.length} Dokumen
                                                </span>
                                            </div>
                                            <p className="text-sm text-base-content/60">
                                                Upload dokumen sesuai persyaratan di bawah ini. <span className="text-error">*</span> = Wajib
                                            </p>
                                            <div className="grid gap-4">
                                                {selectedJenisSurat.persyaratan.map((persyaratan) => {
                                                    const isUploaded = !!lampiran[persyaratan.id];
                                                    return (
                                                        <div key={persyaratan.id} className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <label className="label">
                                                                    <span className="label-text font-medium">
                                                                        {persyaratan.nama}
                                                                        {persyaratan.wajib && <span className="text-error ml-1">*</span>}
                                                                    </span>
                                                                </label>
                                                                {isUploaded && (
                                                                    <span className="badge badge-sm badge-success text-success-content">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Terupload
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="relative">
                                                                <input
                                                                    type="file"
                                                                    id={`file-${persyaratan.id}`}
                                                                    accept={persyaratan.tipe_file === 'image' ? 'image/*' : persyaratan.tipe_file === 'pdf' ? '.pdf' : '*'}
                                                                    onChange={(e) => handleFileChange(persyaratan.id, e.target.files?.[0] || null)}
                                                                    className={`file-input file-input-bordered w-full ${
                                                                        isUploaded ? 'file-input-success' : ''
                                                                    }`}
                                                                    required={persyaratan.wajib}
                                                                />
                                                                {!isUploaded && (
                                                                    <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-base-content/50 pointer-events-none">
                                                                        {tipeFileLabels[persyaratan.tipe_file] || 'Semua file'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {persyaratan.keterangan && (
                                                                <p className="text-xs text-base-content/50 pl-1">
                                                                    {persyaratan.keterangan}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Keperluan */}
                                    <Controller
                                        name="keperluan"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                label="Keperluan"
                                                placeholder="Jelaskan keperluan pengajuan surat ini"
                                                rows={3}
                                                error={errors.keperluan?.message}
                                                {...field}
                                            />
                                        )}
                                    />

                                    {/* Keterangan (Optional) */}
                                    <Controller
                                        name="keterangan"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                label="Keterangan Tambahan"
                                                placeholder="Tambahkan keterangan jika diperlukan"
                                                rows={2}
                                                error={errors.keterangan?.message}
                                                {...field}
                                            />
                                        )}
                                    />

                                    {/* Info Penduduk */}
                                    <Alert variant="soft" color="info">
                                        <span>
                                            Pengajuan akan dibuat atas nama: <strong>{penduduk.nama_lengkap}</strong>
                                        </span>
                                    </Alert>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.visit('/warga')}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            color="primary"
                                            loading={isSubmitting}
                                        >
                                            Ajukan Surat
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Info Persyaratan */}
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-base">Informasi Persyaratan</h2>
                            <p className="text-sm text-base-content/60 mb-3">
                                Setiap jenis surat memiliki persyaratan yang berbeda. Pilih jenis surat untuk melihat persyaratan yang diperlukan.
                            </p>

                            {/* Search */}
                            <div className="mb-4">
                                <label className="input input-sm flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className="grow bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-sm"
                                        placeholder="Cari jenis surat atau persyaratan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs btn-circle"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </label>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Jenis Surat</th>
                                            <th>Persyaratan Dokumen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredJenisSurat.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="text-center py-8 text-base-content/50">
                                                    Tidak ada jenis surat yang cocok dengan pencarian "{searchTerm}"
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredJenisSurat.map((js) => (
                                                <tr key={js.id}>
                                                    <td className="font-medium">{js.nama}</td>
                                                    <td className="text-sm">
                                                        {js.persyaratan && js.persyaratan.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {js.persyaratan.map((p) => (
                                                                    <span
                                                                        key={p.id}
                                                                        className={`badge badge-sm ${p.wajib ? 'badge-error' : 'badge-ghost'}`}
                                                                    >
                                                                        {p.nama}
                                                                        {p.wajib && '*'}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-base-content/50">Tidak ada persyaratan</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-base-content/50 mt-2">* Wajib diupload</p>
                        </div>
                    </div>
                </div>
            </WargaLayout>
        </>
    );
}
