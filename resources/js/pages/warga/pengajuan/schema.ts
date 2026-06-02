import * as yup from 'yup';

export const schema = yup.object().shape({
    jenis_surat_id: yup.number().required('Jenis surat wajib dipilih'),
    keperluan: yup.string().required('Keperluan wajib diisi'),
    keterangan: yup.string().optional(),
});

export const defaultValues = {
    jenis_surat_id: 0,
    keperluan: '',
    keterangan: '',
};

export type FormValues = yup.InferType<typeof schema>;
