import * as yup from 'yup';

export const suratSchema = yup.object({
    jenis_surat_id: yup
        .number()
        .required('Jenis surat wajib dipilih')
        .transform((v, o) => (o === '' || o === null ? undefined : v)),
    penduduk_id: yup
        .number()
        .required('Penduduk wajib dipilih')
        .transform((v, o) => (o === '' || o === null ? undefined : v)),
    perihal: yup.string().required('Perihal wajib diisi').max(255),
    keterangan: yup
        .string()
        .nullable()
        .transform((v) => v || null),
    data_tambahan: yup.object().nullable().default(null),
    tanggal_surat: yup.string().required('Tanggal surat wajib diisi'),
    ditandatangani_oleh: yup
        .string()
        .nullable()
        .max(255)
        .transform((v) => v || null),
    jabatan_penandatangan: yup
        .string()
        .nullable()
        .max(255)
        .transform((v) => v || null),
    pengajuan_surat_id: yup
        .number()
        .nullable()
        .transform((v, o) => (o === '' || o === null ? null : v)),
});

export type SuratFormValues = yup.InferType<typeof suratSchema>;

export const defaultValues: SuratFormValues = {
    jenis_surat_id: undefined as unknown as number,
    penduduk_id: undefined as unknown as number,
    perihal: '',
    keterangan: null,
    data_tambahan: null,
    tanggal_surat: '',
    ditandatangani_oleh: null,
    jabatan_penandatangan: null,
    pengajuan_surat_id: null,
};
