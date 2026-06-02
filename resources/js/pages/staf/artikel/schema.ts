import * as yup from 'yup';

export const artikelSchema = yup.object({
    judul: yup.string().required('Judul wajib diisi').max(255, 'Judul maksimal 255 karakter'),
    slug: yup.string().nullable().transform((v) => v || null).max(255, 'Slug maksimal 255 karakter'),
    ringkasan: yup.string().nullable().transform((v) => v || null).max(500, 'Ringkasan maksimal 500 karakter'),
    isi: yup.string().required('Isi artikel wajib diisi'),
    is_published: yup.boolean().nullable().transform((v) => v ?? false),
});

export type ArtikelFormValues = yup.InferType<typeof artikelSchema>;

export const defaultValues: ArtikelFormValues = {
    judul: '',
    slug: null,
    ringkasan: null,
    isi: '',
    is_published: false,
};
