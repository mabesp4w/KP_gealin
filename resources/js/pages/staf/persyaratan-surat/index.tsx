import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    TextInput,
    Textarea,
    Modal,
    ModalHeader,
    ModalBody,
    ModalAction,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableCell,
    Badge,
    showError,
    Tooltip,
    Checkbox,
    NativeSelect,
} from '@/components/ui';
import StafLayout from '@/layouts/StafLayout';
import { persyaratanSuratSchema, defaultValues, type PersyaratanSuratFormValues } from './schema';

// ── Types ──────────────────────────────────────────────────

interface JenisSurat {
    id: number;
    kode: string;
    nama: string;
}

interface PersyaratanSurat {
    id: number;
    jenis_surat_id: number;
    nama: string;
    tipe_file: 'image' | 'pdf' | 'document';
    wajib: boolean;
    urutan: number;
    keterangan: string | null;
    jenis_surat: JenisSurat;
}

interface Props {
    persyaratan: PersyaratanSurat[];
    jenisSurat: JenisSurat[];
    filters: { jenis_surat_id: string | null };
}

const tipeFileOptions = [
    { value: 'image', label: 'Gambar (JPG, PNG, dll)' },
    { value: 'pdf', label: 'PDF' },
    { value: 'document', label: 'Dokumen Lainnya' },
];

// ── Component ──────────────────────────────────────────────

export default function PersyaratanSuratIndex({ persyaratan, jenisSurat, filters }: Props) {
    const [filterJenisSurat, setFilterJenisSurat] = useState(filters.jenis_surat_id || '');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PersyaratanSurat | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<PersyaratanSurat | null>(null);

    const { control, handleSubmit, reset, setError, formState: { errors } } = useForm<PersyaratanSuratFormValues>({
        resolver: yupResolver(persyaratanSuratSchema),
        defaultValues,
    });

    useEffect(() => {
        setFilterJenisSurat(filters.jenis_surat_id || '');
    }, [filters.jenis_surat_id]);

    useEffect(() => {
        if (!isFormOpen) {
            reset(defaultValues);
            setEditingItem(null);
        }
    }, [isFormOpen, reset]);

    // ── Filter ──────────────────────────────────────────────

    const handleFilterChange = (jenisSuratId: string) => {
        setFilterJenisSurat(jenisSuratId);
        router.get('/staf/persyaratan-surat', {
            jenis_surat_id: jenisSuratId || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // ── Modal handlers ─────────────────────────────────────

    const openCreate = useCallback(() => {
        setEditingItem(null);
        reset({
            ...defaultValues,
            jenis_surat_id: filterJenisSurat || '',
        });
        setIsFormOpen(true);
    }, [reset, filterJenisSurat]);

    const openEdit = useCallback((item: PersyaratanSurat) => {
        setEditingItem(item);
        reset({
            jenis_surat_id: String(item.jenis_surat_id),
            nama: item.nama,
            tipe_file: item.tipe_file,
            wajib: item.wajib,
            urutan: item.urutan,
            keterangan: item.keterangan || '',
        });
        setIsFormOpen(true);
    }, [reset]);

    const closeForm = useCallback(() => setIsFormOpen(false), []);

    // ── Form Submit ────────────────────────────────────────

    const onSubmit = useCallback((values: PersyaratanSuratFormValues) => {
        setIsSubmitting(true);
        router.post(
            editingItem ? `/staf/persyaratan-surat/${editingItem.id}` : '/staf/persyaratan-surat',
            {
                ...values,
                _method: editingItem ? 'PUT' : 'POST',
            },
            {
                onError: (serverErrors) => {
                    Object.entries(serverErrors).forEach(([field, msg]) => {
                        setError(field as keyof PersyaratanSuratFormValues, { type: 'server', message: msg as string });
                    });
                    showError(Object.values(serverErrors)[0] as string || 'Gagal menyimpan persyaratan.');
                },
                onSuccess: () => closeForm(),
                onFinish: () => setIsSubmitting(false),
            }
        );
    }, [editingItem, setError, closeForm]);

    // ── Actions ─────────────────────────────────────────────

    const handleDelete = useCallback((item: PersyaratanSurat) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    }, []);

    const executeDelete = useCallback(() => {
        if (!deletingItem) return;
        router.delete(`/staf/persyaratan-surat/${deletingItem.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingItem(null);
            },
            onError: () => showError('Gagal menghapus persyaratan.'),
        });
    }, [deletingItem]);

    // ── Render ─────────────────────────────────────────────

    const filteredPersyaratan = filterJenisSurat
        ? persyaratan.filter(p => p.jenis_surat_id === Number(filterJenisSurat))
        : persyaratan;

    const getJenisSuratNama = (id: number): string => {
        const js = jenisSurat.find(j => j.id === id);
        return js ? `${js.kode} - ${js.nama}` : '—';
    };

    return (
        <StafLayout
            title="Manajemen Persyaratan Surat"
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Persyaratan Surat' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Persyaratan Surat</h1>
                        <p className="text-sm opacity-70">Kelola dokumen persyaratan untuk setiap jenis surat</p>
                    </div>
                    <Button color="primary" onClick={openCreate}>
                        + Tambah Persyaratan
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label className="text-sm font-medium min-w-fit">Filter Jenis Surat:</label>
                            <NativeSelect
                                placeholder="Semua Jenis Surat"
                                options={[
                                    { value: '', label: 'Semua Jenis Surat' },
                                    ...jenisSurat.map(js => ({ value: String(js.id), label: `${js.kode} - ${js.nama}` }))
                                ]}
                                value={filterJenisSurat}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="max-w-xs"
                            />
                        </div>
                        <p className="text-xs text-base-content/50 mt-2">
                            Menampilkan {filteredPersyaratan.length} persyaratan
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow overflow-x-auto">
                    <Table className="table-sm">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>No</TableHeaderCell>
                                <TableHeaderCell>Jenis Surat</TableHeaderCell>
                                <TableHeaderCell>Nama Persyaratan</TableHeaderCell>
                                <TableHeaderCell className="hidden md:table-cell">Tipe File</TableHeaderCell>
                                <TableHeaderCell className="hidden lg:table-cell">Urutan</TableHeaderCell>
                                <TableHeaderCell>Wajib</TableHeaderCell>
                                <TableHeaderCell className="text-center">Aksi</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPersyaratan.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <div className="text-sm opacity-50">
                                            {filterJenisSurat ? 'Belum ada persyaratan untuk jenis surat ini' : 'Belum ada data persyaratan'}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPersyaratan.map((item, idx) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <span className="font-medium">{item.jenis_surat.kode}</span>
                                                <span className="text-xs opacity-60 ml-1">{item.jenis_surat.nama}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.nama}</div>
                                            {item.keterangan && (
                                                <div className="text-xs opacity-60 max-w-xs truncate">{item.keterangan}</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge color="neutral" size="sm">
                                                {tipeFileOptions.find(t => t.value === item.tipe_file)?.label || item.tipe_file}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <span className="badge badge-ghost badge-sm">{item.urutan}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge color={item.wajib ? 'error' : 'neutral'} size="sm">
                                                {item.wajib ? 'Wajib' : 'Opsional'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                <Tooltip content="Edit">
                                                    <Button
                                                        size="sm"
                                                        color="warning"
                                                        variant="soft"
                                                        circle
                                                        onClick={() => openEdit(item)}
                                                        title="Edit Data"
                                                    >
                                                        ✏️
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Hapus">
                                                    <Button
                                                        size="sm"
                                                        color="error"
                                                        variant="soft"
                                                        circle
                                                        onClick={() => handleDelete(item)}
                                                        title="Hapus Data"
                                                    >
                                                        🗑️
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Form Modal */}
                <Modal open={isFormOpen} onClose={closeForm} boxClassName="max-w-2xl w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader>
                            {editingItem ? 'Edit Persyaratan Surat' : 'Tambah Persyaratan Surat Baru'}
                        </ModalHeader>
                        <ModalBody className="space-y-4">
                            {/* Section: Identitas */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold opacity-70 border-b pb-1">Identitas Persyaratan</h3>

                                <Controller
                                    name="jenis_surat_id"
                                    control={control}
                                    render={({ field }) => (
                                        <NativeSelect
                                            label="Jenis Surat"
                                            placeholder="Pilih jenis surat"
                                            options={jenisSurat.map(js => ({ value: String(js.id), label: `${js.kode} - ${js.nama}` }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={errors.jenis_surat_id?.message}
                                            disabled={!!editingItem}
                                        />
                                    )}
                                />

                                <Controller
                                    name="nama"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Nama Persyaratan"
                                            placeholder="Contoh: KTP, KK, Foto Rumah"
                                            error={errors.nama?.message}
                                            {...field}
                                        />
                                    )}
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Controller
                                        name="tipe_file"
                                        control={control}
                                        render={({ field }) => (
                                            <NativeSelect
                                                label="Tipe File"
                                                placeholder="Pilih tipe file"
                                                options={tipeFileOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.tipe_file?.message}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="urutan"
                                        control={control}
                                        render={({ field }) => (
                                            <TextInput
                                                type="number"
                                                label="Urutan"
                                                placeholder="Otomatis"
                                                error={errors.urutan?.message}
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        )}
                                    />
                                </div>

                                <Controller
                                    name="keterangan"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            label="Keterangan"
                                            placeholder="Keterangan tambahan tentang persyaratan ini..."
                                            error={errors.keterangan?.message}
                                            rows={2}
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    )}
                                />
                            </div>

                            {/* Section: Pengaturan */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold opacity-70 border-b pb-1">Pengaturan</h3>

                                <Controller
                                    name="wajib"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Persyaratan wajib"
                                            desc="Dokumen ini wajib diupload oleh warga"
                                            checked={field.value ?? true}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </ModalBody>
                        <ModalAction>
                            <Button type="button" variant="outline" onClick={closeForm}>
                                Batal
                            </Button>
                            <Button type="submit" color="primary" loading={isSubmitting}>
                                {editingItem ? 'Simpan Perubahan' : 'Simpan'}
                            </Button>
                        </ModalAction>
                    </form>
                </Modal>

                {/* Delete Modal */}
                <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                    <ModalHeader>Hapus Persyaratan Surat</ModalHeader>
                    <ModalBody>
                        <p>Yakin ingin menghapus persyaratan <strong>"{deletingItem?.nama}"</strong>?</p>
                        <p className="text-sm text-error mt-2">Tindakan ini tidak dapat dibatalkan.</p>
                    </ModalBody>
                    <ModalAction>
                        <Button color="ghost" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
                        <Button color="error" onClick={executeDelete}>Hapus</Button>
                    </ModalAction>
                </Modal>
            </div>
        </StafLayout>
    );
}
