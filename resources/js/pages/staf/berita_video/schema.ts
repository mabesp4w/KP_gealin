import * as yup from 'yup';

export const beritaVideoSchema = yup.object({
    judul: yup.string().required('Judul wajib diisi').max(255, 'Judul maksimal 255 karakter'),
    slug: yup.string().nullable().transform((v) => v || null).max(255, 'Slug maksimal 255 karakter'),
    ringkasan: yup.string().nullable().transform((v) => v || null).max(500, 'Ringkasan maksimal 500 karakter'),
    isi: yup.string().required('Isi berita video wajib diisi'),
    video_url: yup.string().required('URL video wajib diisi').url('URL video harus berupa URL yang valid').max(500, 'URL video maksimal 500 karakter'),
    is_published: yup.boolean().nullable().transform((v) => v ?? false),
});

export type BeritaVideoFormValues = yup.InferType<typeof beritaVideoSchema>;

export const defaultValues: BeritaVideoFormValues = {
    judul: '',
    slug: null,
    ringkasan: null,
    isi: '',
    video_url: '',
    is_published: false,
};
