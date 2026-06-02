import { yupResolver } from '@hookform/resolvers/yup';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    TextInput,
    Textarea,
    Checkbox,
    RichTextEditor,
    showError,
} from '@/components/ui';
import StafLayout from '@/layouts/StafLayout';
import { beritaSchema, defaultValues, type BeritaFormValues } from './schema';

interface Item {
    id: number;
    judul: string;
    slug: string | null;
    ringkasan: string | null;
    isi: string;
    gambar: string | null;
    is_published: boolean;
}

interface Props {
    item?: Item;
}

export default function BeritaForm({ item }: Props) {
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
    } = useForm<BeritaFormValues>({
        resolver: yupResolver(beritaSchema),
        defaultValues: item
            ? {
                  judul: item.judul,
                  slug: item.slug,
                  ringkasan: item.ringkasan,
                  isi: item.isi,
                  is_published: item.is_published,
              }
            : defaultValues,
    });

    const onSubmit = (values: BeritaFormValues) => {
        setIsSubmitting(true);
        const url = isEditing ? `/staf/berita/${item.id}` : '/staf/berita';
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
                    setError(field as keyof BeritaFormValues, { type: 'server', message });
                });
                showError(firstMsg || 'Gagal menyimpan. Periksa kembali form.');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <StafLayout
            title={isEditing ? 'Edit Berita' : 'Tambah Berita'}
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Berita', href: '/staf/berita' },
                { label: isEditing ? 'Edit' : 'Tambah' },
            ]}
        >
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Berita' : 'Tambah Berita'}</h1>
                        <p className="text-base-content/60 mt-1">
                            {isEditing ? 'Perbarui informasi berita' : 'Buat berita baru'}
                        </p>
                    </div>
                    <Button color="ghost" onClick={() => router.visit('/staf/berita')}>
                        Kembali
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h4 className="text-sm font-semibold text-primary mb-3">Informasi Berita</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="judul"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Judul Berita"
                                            placeholder="Judul berita"
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
                            <h4 className="text-sm font-semibold text-primary mb-3">Konten Berita</h4>
                            <Controller
                                name="ringkasan"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        label="Ringkasan (opsional)"
                                        rows={2}
                                        placeholder="Ringkasan singkat berita"
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
                                            label="Isi Berita"
                                            placeholder="Tulis konten berita di sini..."
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
                        <Button type="button" color="ghost" onClick={() => router.visit('/staf/berita')}>
                            Batal
                        </Button>
                        <Button type="submit" color="primary" loading={isSubmitting}>
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Berita'}
                        </Button>
                    </div>
                </form>
            </div>
        </StafLayout>
    );
}
