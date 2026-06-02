import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
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
import { beritaVideoSchema, defaultValues, type BeritaVideoFormValues } from './schema';

interface Item {
    id: number;
    judul: string;
    slug: string | null;
    ringkasan: string | null;
    isi: string;
    video_url: string | null;
    is_published: boolean;
}

interface Props {
    item?: Item;
}

export default function BeritaVideoForm({ item }: Props) {
    const isEditing = !!item;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<BeritaVideoFormValues>({
        resolver: yupResolver(beritaVideoSchema),
        defaultValues: item
            ? {
                  judul: item.judul,
                  slug: item.slug,
                  ringkasan: item.ringkasan,
                  isi: item.isi,
                  video_url: item.video_url ?? '',
                  is_published: item.is_published,
              }
            : defaultValues,
    });

    const onSubmit = (values: BeritaVideoFormValues) => {
        setIsSubmitting(true);
        const url = isEditing ? `/staf/berita-video/${item.id}` : '/staf/berita-video';
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, String(value));
            }
        });
        if (isEditing) formData.append('_method', 'PUT');
        router.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onError: (serverErrors: Record<string, string>) => {
                let firstMsg = '';
                Object.entries(serverErrors).forEach(([field, message]) => {
                    if (!firstMsg) firstMsg = message;
                    setError(field as keyof BeritaVideoFormValues, { type: 'server', message });
                });
                showError(firstMsg || 'Gagal menyimpan. Periksa kembali form.');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <StafLayout
            title={isEditing ? 'Edit Berita Video' : 'Tambah Berita Video'}
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Berita Video', href: '/staf/berita-video' },
                { label: isEditing ? 'Edit' : 'Tambah' },
            ]}
        >
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Berita Video' : 'Tambah Berita Video'}</h1>
                        <p className="text-base-content/60 mt-1">
                            {isEditing ? 'Perbarui informasi berita video' : 'Buat berita video baru'}
                        </p>
                    </div>
                    <Button color="ghost" onClick={() => router.visit('/staf/berita-video')}>
                        Kembali
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h4 className="text-sm font-semibold text-primary mb-3">Informasi Video</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="judul"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Judul Video"
                                            placeholder="Judul berita video"
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
                            <h4 className="text-sm font-semibold text-primary mb-3">Konten Video</h4>
                            <Controller
                                name="ringkasan"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        label="Ringkasan (opsional)"
                                        rows={2}
                                        placeholder="Ringkasan singkat video"
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
                                            label="Deskripsi Video"
                                            placeholder="Tulis deskripsi video di sini..."
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
                            <h4 className="text-sm font-semibold text-primary mb-3">URL Video</h4>
                            <Controller
                                name="video_url"
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        label="URL Video"
                                        placeholder="https://youtube.com/watch?v=..."
                                        {...field}
                                        value={field.value ?? ''}
                                        error={errors.video_url?.message}
                                        required
                                    />
                                )}
                            />
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
                        <Button type="button" color="ghost" onClick={() => router.visit('/staf/berita-video')}>
                            Batal
                        </Button>
                        <Button type="submit" color="primary" loading={isSubmitting}>
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Berita Video'}
                        </Button>
                    </div>
                </form>
            </div>
        </StafLayout>
    );
}
