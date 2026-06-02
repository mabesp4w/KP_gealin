import * as yup from 'yup';

export const persyaratanSuratSchema = yup.object({
    jenis_surat_id: yup.string()
        .required('Jenis surat wajib dipilih'),
    nama: yup.string()
        .required('Nama persyaratan wajib diisi')
        .max(100, 'Nama maksimal 100 karakter'),
    tipe_file: yup.string()
        .required('Tipe file wajib dipilih')
        .oneOf(['image', 'pdf', 'document'], 'Tipe file tidak valid'),
    wajib: yup.boolean()
        .nullable()
        .transform((v) => v ?? true),
    urutan: yup.number()
        .nullable()
        .transform((v, o) => o === '' || o === null ? null : Number(v))
        .min(0, 'Urutan minimal 0')
        .integer('Urutan harus bilangan bulat'),
    keterangan: yup.string()
        .nullable()
        .transform((v) => v || null)
        .max(500, 'Keterangan maksimal 500 karakter'),
});

export type PersyaratanSuratFormValues = yup.InferType<typeof persyaratanSuratSchema>;

export const defaultValues: PersyaratanSuratFormValues = {
    jenis_surat_id: '',
    nama: '',
    tipe_file: 'image',
    wajib: true,
    urutan: null,
    keterangan: null,
};
