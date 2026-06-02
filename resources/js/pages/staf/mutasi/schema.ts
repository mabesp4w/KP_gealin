import * as yup from 'yup';

export const mutasiSchema = yup.object({
    penduduk_id: yup.number().required('Penduduk wajib dipilih').typeError('Penduduk wajib dipilih'),
    jenis_mutasi: yup.string().required('Jenis mutasi wajib dipilih').oneOf(['masuk', 'keluar', 'meninggal', 'lahir'], 'Jenis mutasi tidak valid'),
    tanggal_mutasi: yup.string().required('Tanggal mutasi wajib dipilih'),
    asal_tujuan: yup.string().nullable().max(255).transform((v) => v || null),
    alasan: yup.string().nullable().transform((v) => v || null),
    keterangan: yup.string().nullable().transform((v) => v || null),
});

export type MutasiFormValues = yup.InferType<typeof mutasiSchema>;

export const defaultValues: MutasiFormValues = {
    penduduk_id: 0,
    jenis_mutasi: '',
    tanggal_mutasi: '',
    asal_tujuan: null,
    alasan: null,
    keterangan: null,
};
