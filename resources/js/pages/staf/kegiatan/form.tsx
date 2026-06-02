import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    TextInput,
    Textarea,
    DatePickerInput,
    Checkbox,
    RichTextEditor,
    showError,
} from '@/components/ui';
import StafLayout from '@/layouts/StafLayout';
import { kegiatanSchema, defaultValues, type KegiatanFormValues } from './schema';
import { parseDate, toDateString } from '@/lib/date';

interface Item {
    id: number;
    judul: string;
    slug: string | null;
    ringkasan: string | null;
    isi: string;
    gambar: string | null;
    tanggal_kegiatan: string | null;
    lokasi: string | null;
    is_published: boolean;
}

interface Props {
    item?: Item;
}

export default function KegiatanForm({ item }: Props) {
    const isEditing = !!item;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gambarPreview, setGambarPreview] = useState<string | null>(
        item?.gambar ? `/storage/${item.gambar}` : null,
    );

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<KegiatanFormValues>({
        resolver: yupResolver(kegiatanSchema),
        defaultValues: item
            ? {
                  judul: item.judul,
                  slug: item.slug,
                  ringkasan: item.ringkasan,
                  isi: item.isi,
                  tanggal_kegiatan: item.tanggal_kegiatan,
                  lokasi: item.lokasi,
                  is_published: item.is_published,
              }
            : defaultValues,
    });

    const onSubmit = (values: KegiatanFormValues) => {
        setIsSubmitting(true);
        const url = isEditing ? `/staf/kegiatan/${item.id}` : '/staf/kegiatan';
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, String(value));
            }
        });
        const fileInput = document.querySelector<HTMLInputElement>('input[name="gambar"]');
        if (fileInput?.files?.[0]) formData.append('gambar', fileInput.files[0]);
        if (isEditing) formData.append('_method', 'PUT');
        router.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onError: (serverErrors: Record<string, string>) => {
                let firstMsg = '';
                Object.entries(serverErrors).forEach(([field, message]) => {
                    if (!firstMsg) firstMsg = message;
                    setError(field as keyof KegiatanFormValues, { type: 'server', message });
                });
                showError(firstMsg || 'Gagal menyimpan. Periksa kembali form.');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <StafLayout
            title={isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Kegiatan', href: '/staf/kegiatan' },
                { label: isEditing ? 'Edit' : 'Tambah' },
            ]}
        >
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h1>
                        <p className="text-base-content/60 mt-1">
                            {isEditing ? 'Perbarui informasi kegiatan' : 'Buat kegiatan baru'}
                        </p>
                    </div>
                    <Button color="ghost" onClick={() => router.visit('/staf/kegiatan')}>
                        Kembali
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h4 className="text-sm font-semibold text-primary mb-3">Informasi Kegiatan</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="judul"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Judul Kegiatan"
                                            placeholder="Judul kegiatan"
                                            {...field}
                                            error={errors.judul?.message}
                                            required
                                        />
                                    )}
                                />
                                <Controller
                                    name="slug"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Slug (opsional)"
                                            placeholder="Kosongkan untuk generate otomatis"
                                            {...field}
                                            value={field.value ?? ''}
                                            error={errors.slug?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h4 className="text-sm font-semibold text-primary mb-3">Konten Kegiatan</h4>
                            <Controller
                                name="ringkasan"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        label="Ringkasan (opsional)"
                                        rows={2}
                                        placeholder="Ringkasan singkat kegiatan"
                                        {...field}
                                        value={field.value ?? ''}
                                        error={errors.ringkasan?.message}
                                    />
                                )}
                            />
                            <div className="mt-4">
                                <Controller
                                    name="isi"
                                    control={control}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            label="Isi Kegiatan"
                                            placeholder="Tulis deskripsi kegiatan di sini..."
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            error={errors.isi?.message}
                                            required
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h4 className="text-sm font-semibold text-primary mb-3">Detail Kegiatan</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="tanggal_kegiatan"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePickerInput
                                            label="Tanggal Kegiatan"
                                            selected={parseDate(field.value)}
                                            onChange={(date) => field.onChange(toDateString(date))}
                                            placeholder="Pilih tanggal kegiatan"
                                            isClearable
                                        />
                                    )}
                                />
                                <Controller
                                    name="lokasi"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Lokasi Kegiatan"
                                            placeholder="Lokasi kegiatan"
                                            {...field}
                                            value={field.value ?? ''}
                                            error={errors.lokasi?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h4 className="text-sm font-semibold text-primary mb-3">Gambar</h4>
                            <input
                                type="file"
                                name="gambar"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                className="file-input file-input-bordered w-full"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f && f.size > 2 * 1024 * 1024) {
                                        showError('Ukuran gambar maksimal 2MB');
                                        e.target.value = '';
                                        setGambarPreview(null);
                                        return;
                                    }
                                    setGambarPreview(f ? URL.createObjectURL(f) : null);
                                }}
                            />
                            {(errors as any).gambar?.message && (
                                <span className="text-error text-xs mt-1">
                                    {(errors as any).gambar.message}
                                </span>
                            )}
                            {gambarPreview && (
                                <img
                                    src={gambarPreview}
                                    alt="Preview"
                                    className="mt-2 h-32 w-auto rounded object-cover"
                                />
                            )}
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h4 className="text-sm font-semibold text-primary mb-3">Publikasi</h4>
                            <Controller
                                name="is_published"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="is_published"
                                            checked={field.value ?? false}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                        <label htmlFor="is_published" className="cursor-pointer select-none">
                                            Publikasikan langsung
                                        </label>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" color="ghost" onClick={() => router.visit('/staf/kegiatan')}>
                            Batal
                        </Button>
                        <Button type="submit" color="primary" loading={isSubmitting}>
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
                        </Button>
                    </div>
                </form>
            </div>
        </StafLayout>
    );
}
