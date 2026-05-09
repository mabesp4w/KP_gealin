import * as yup from 'yup';

export const kartuKeluargaSchema = yup.object({
    nomor_kk: yup.string().required('Nomor KK wajib diisi').length(16, 'Nomor KK harus 16 digit'),
    alamat: yup.string().required('Alamat wajib diisi'),
    rt: yup.string().required('RT wajib diisi').max(5),
    rw: yup.string().required('RW wajib diisi').max(5),
    kelurahan: yup.string().default('Ardipura').max(100),
    kecamatan: yup.string().default('Jayapura Selatan').max(100),
    kabupaten_kota: yup.string().default('Kota Jayapura').max(100),
    provinsi: yup.string().default('Papua').max(100),
    kode_pos: yup.string().nullable().max(10).transform((v) => v || null),
    tanggal_dikeluarkan: yup.string().nullable().transform((v) => v || null),
});

export type KartuKeluargaFormValues = yup.InferType<typeof kartuKeluargaSchema>;

export const defaultValues: KartuKeluargaFormValues = {
    nomor_kk: '',
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: 'Ardipura',
    kecamatan: 'Jayapura Selatan',
    kabupaten_kota: 'Kota Jayapura',
    provinsi: 'Papua',
    kode_pos: null,
    tanggal_dikeluarkan: null,
};
