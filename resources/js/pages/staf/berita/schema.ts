import * as yup from 'yup';

export const beritaSchema = yup.object({
    judul: yup.string().required('Judul wajib diisi').max(255, 'Judul maksimal 255 karakter'),
    slug: yup.string().nullable().transform((v) => v || null).max(255, 'Slug maksimal 255 karakter'),
    ringkasan: yup.string().nullable().transform((v) => v || null).max(500, 'Ringkasan maksimal 500 karakter'),
    isi: yup.string().required('Isi berita wajib diisi'),
    is_published: yup.boolean().nullable().transform((v) => v ?? false),
});

export type BeritaFormValues = yup.InferType<typeof beritaSchema>;

export const defaultValues: BeritaFormValues = {
    judul: '',
    slug: null,
    ringkasan: null,
    isi: '',
    is_published: false,
};
