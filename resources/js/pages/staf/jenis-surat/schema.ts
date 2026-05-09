import * as yup from 'yup';

export const jenisSuratSchema = yup.object({
    kode: yup.string()
        .required('Kode wajib diisi')
        .max(20, 'Kode maksimal 20 karakter')
        .matches(/^[A-Z0-9-]+$/, 'Kode hanya boleh huruf besar, angka, dan tanda minus'),
    nama: yup.string()
        .required('Nama wajib diisi')
        .max(255, 'Nama maksimal 255 karakter'),
    deskripsi: yup.string()
        .nullable()
        .transform((v) => v || null)
        .max(500, 'Deskripsi maksimal 500 karakter'),
    is_active: yup.boolean()
        .nullable()
        .transform((v) => v ?? true),
    bisa_diajukan_warga: yup.boolean()
        .nullable()
        .transform((v) => v ?? true),
    urutan: yup.number()
        .nullable()
        .transform((v, o) => o === '' || o === null ? null : Number(v))
        .min(0, 'Urutan minimal 0')
        .integer('Urutan harus bilangan bulat'),
});

export type JenisSuratFormValues = yup.InferType<typeof jenisSuratSchema>;

export const defaultValues: JenisSuratFormValues = {
    kode: '',
    nama: '',
    deskripsi: null,
    is_active: true,
    bisa_diajukan_warga: true,
    urutan: null,
};
