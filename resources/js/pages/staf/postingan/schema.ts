import * as yup from 'yup';

export const KATEGORI_OPTIONS = [
    { value: 'berita', label: 'Berita' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'pengumuman', label: 'Pengumuman' },
    { value: 'berita_video', label: 'Berita Video' },
    { value: 'artikel', label: 'Artikel' },
];

export const postinganSchema = yup.object({
    kategori: yup.string()
        .required('Kategori wajib dipilih')
        .oneOf(['berita', 'kegiatan', 'pengumuman', 'berita_video', 'artikel'], 'Kategori tidak valid'),
    judul: yup.string()
        .required('Judul wajib diisi')
        .max(255, 'Judul maksimal 255 karakter'),
    slug: yup.string()
        .nullable()
        .transform((v) => v || null)
        .max(255, 'Slug maksimal 255 karakter'),
    ringkasan: yup.string()
        .nullable()
        .transform((v) => v || null)
        .max(500, 'Ringkasan maksimal 500 karakter'),
    isi: yup.string()
        .required('Isi konten wajib diisi'),
    video_url: yup.string()
        .nullable()
        .transform((v) => v || null)
        .url('URL video harus berupa URL yang valid')
        .max(500, 'URL video maksimal 500 karakter'),
    tanggal_kegiatan: yup.string()
        .nullable()
        .transform((v) => v || null),
    lokasi: yup.string()
        .nullable()
        .transform((v) => v || null)
        .max(255, 'Lokasi maksimal 255 karakter'),
    is_published: yup.boolean()
        .nullable()
        .transform((v) => v ?? false),
});

export type PostinganFormValues = yup.InferType<typeof postinganSchema>;

export const defaultValues: PostinganFormValues = {
    kategori: 'berita',
    judul: '',
    slug: null,
    ringkasan: null,
    isi: '',
    video_url: null,
    tanggal_kegiatan: null,
    lokasi: null,
    is_published: false,
};
