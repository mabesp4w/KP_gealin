import * as yup from 'yup';

export const kegiatanSchema = yup.object({
    judul: yup.string().required('Judul wajib diisi').max(255, 'Judul maksimal 255 karakter'),
    slug: yup.string().nullable().transform((v) => v || null).max(255, 'Slug maksimal 255 karakter'),
    ringkasan: yup.string().nullable().transform((v) => v || null).max(500, 'Ringkasan maksimal 500 karakter'),
    isi: yup.string().required('Isi kegiatan wajib diisi'),
    tanggal_kegiatan: yup.string().nullable().transform((v) => v || null),
    lokasi: yup.string().nullable().transform((v) => v || null).max(255, 'Lokasi maksimal 255 karakter'),
    is_published: yup.boolean().nullable().transform((v) => v ?? false),
});

export type KegiatanFormValues = yup.InferType<typeof kegiatanSchema>;

export const defaultValues: KegiatanFormValues = {
    judul: '',
    slug: null,
    ringkasan: null,
    isi: '',
    tanggal_kegiatan: null,
    lokasi: null,
    is_published: false,
};
