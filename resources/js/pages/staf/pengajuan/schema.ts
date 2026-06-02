import * as yup from 'yup';

export const pengajuanSchema = yup.object({
    penduduk_id: yup.number().required('Penduduk wajib dipilih').typeError('Penduduk wajib dipilih'),
    jenis_surat_id: yup.number().required('Jenis surat wajib dipilih').typeError('Jenis surat wajib dipilih'),
    keperluan: yup.string().required('Keperluan wajib diisi').max(500, 'Maksimal 500 karakter'),
    keterangan: yup.string().nullable().transform((v) => v || null),
    data_tambahan: yup.object().nullable().default(null),
});

export type PengajuanFormValues = yup.InferType<typeof pengajuanSchema>;

export const defaultValues: PengajuanFormValues = {
    penduduk_id: 0,
    jenis_surat_id: 0,
    keperluan: '',
    keterangan: null,
    data_tambahan: null,
};

// Status update schema
export const statusUpdateSchema = yup.object({
    status: yup.string().required('Status wajib dipilih').oneOf(['menunggu', 'diproses', 'selesai', 'ditolak'], 'Status tidak valid'),
    catatan_staf: yup.string().nullable().transform((v) => v || null),
});

export type StatusUpdateFormValues = yup.InferType<typeof statusUpdateSchema>;
