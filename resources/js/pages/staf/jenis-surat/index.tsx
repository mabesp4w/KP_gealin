import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
} from '@/components/ui';
import StafLayout from '@/layouts/StafLayout';
import { jenisSuratSchema, defaultValues, type JenisSuratFormValues } from './schema';

// ── Types ──────────────────────────────────────────────────

interface JenisSurat {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    template_fields: Record<string, unknown> | null;
    is_active: boolean;
    bisa_diajukan_warga: boolean;
    urutan: number;
    created_at: string;
    surat_count?: number;
    pengajuan_count?: number;
}

interface Props {
    jenisSurat: JenisSurat[];
    filters: { search: string };
}

// ── Component ──────────────────────────────────────────────

export default function JenisSuratIndex({ jenisSurat, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<JenisSurat | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<JenisSurat | null>(null);

    const { control, handleSubmit, reset, setError, formState: { errors } } = useForm<JenisSuratFormValues>({
        resolver: yupResolver(jenisSuratSchema),
        defaultValues,
    });

    useEffect(() => {
        setSearch(filters.search);
    }, [filters.search]);

    useEffect(() => {
        if (!isFormOpen) {
            reset(defaultValues);
            setEditingItem(null);
        }
    }, [isFormOpen, reset]);

    // ── Search (debounced auto-search) ──────────────────────

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const doSearch = useCallback((keyword: string) => {
        router.get('/staf/jenis-surat', {
            search: keyword.trim() || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, []);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value), 300);
    };

    // ── Modal handlers ─────────────────────────────────────

    const openCreate = useCallback(() => {
        setEditingItem(null);
        reset(defaultValues);
        setIsFormOpen(true);
    }, [reset]);

    const openEdit = useCallback((item: JenisSurat) => {
        setEditingItem(item);
        reset({
            kode: item.kode,
            nama: item.nama,
            deskripsi: item.deskripsi || '',
            is_active: item.is_active,
            bisa_diajukan_warga: item.bisa_diajukan_warga,
            urutan: item.urutan,
        });
        setIsFormOpen(true);
    }, [reset]);

    const closeForm = useCallback(() => setIsFormOpen(false), []);

    // ── Form Submit ────────────────────────────────────────

    const onSubmit = useCallback((values: JenisSuratFormValues) => {
        setIsSubmitting(true);
        router.post(
            editingItem ? `/staf/jenis-surat/${editingItem.id}` : '/staf/jenis-surat',
            {
                ...values,
                _method: editingItem ? 'PUT' : 'POST',
            },
            {
                onError: (serverErrors) => {
                    Object.entries(serverErrors).forEach(([field, msg]) => {
                        setError(field as keyof JenisSuratFormValues, { type: 'server', message: msg as string });
                    });
                    showError(Object.values(serverErrors)[0] as string || 'Gagal menyimpan jenis surat.');
                },
                onSuccess: () => closeForm(),
                onFinish: () => setIsSubmitting(false),
            }
        );
    }, [editingItem, setError, closeForm]);

    // ── Actions ─────────────────────────────────────────────

    const handleDelete = useCallback((item: JenisSurat) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    }, []);

    const executeDelete = useCallback(() => {
        if (!deletingItem) return;
        router.delete(`/staf/jenis-surat/${deletingItem.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingItem(null);
            },
            onError: () => showError('Gagal menghapus jenis surat.'),
        });
    }, [deletingItem]);

    const handleToggleActive = useCallback((item: JenisSurat) => {
        router.put(`/staf/jenis-surat/${item.id}`, {
            ...item,
            is_active: !item.is_active,
            _method: 'PUT',
        }, {
            onError: () => showError('Gagal mengubah status jenis surat.'),
        });
    }, []);

    // ── Render ─────────────────────────────────────────────
    return (
        <StafLayout
            title="Manajemen Jenis Surat"
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Jenis Surat' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Jenis Surat</h1>
                        <p className="text-sm opacity-70">Kelola jenis-jenis surat kelurahan</p>
                    </div>
                    <Button color="primary" onClick={openCreate}>
                        + Tambah Jenis Surat
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label className="input flex-1 min-w-0 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    className="grow bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0"
                                    placeholder="Cari kode atau nama jenis surat..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                                {search && (
                                    <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={() => handleSearchChange('')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </label>
                        </div>
                        <p className="text-xs text-base-content/50 mt-2">
                            Menampilkan {jenisSurat.length} jenis surat
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow overflow-x-auto">
                    <Table className="table-sm">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>No</TableHeaderCell>
                                <TableHeaderCell>Kode</TableHeaderCell>
                                <TableHeaderCell>Nama</TableHeaderCell>
                                <TableHeaderCell className="hidden md:table-cell">Deskripsi</TableHeaderCell>
                                <TableHeaderCell className="hidden lg:table-cell">Urutan</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell>Warga</TableHeaderCell>
                                <TableHeaderCell className="text-center">Aksi</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jenisSurat.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        <div className="text-sm opacity-50">Belum ada data jenis surat</div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                jenisSurat.map((item, idx) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            <span className="font-mono text-sm font-medium">{item.kode}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.nama}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="text-sm max-w-xs truncate opacity-70">{item.deskripsi || '-'}</div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <span className="badge badge-ghost badge-sm">{item.urutan}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge color={item.is_active ? 'success' : 'error'} size="sm">
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge color={item.bisa_diajukan_warga ? 'info' : 'neutral'} size="sm">
                                                {item.bisa_diajukan_warga ? 'Ya' : 'Tidak'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                <Tooltip content={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                                                    <Button
                                                        size="sm"
                                                        color={item.is_active ? 'success' : 'neutral'}
                                                        variant="soft"
                                                        circle
                                                        onClick={() => handleToggleActive(item)}
                                                        title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                    >
                                                        {item.is_active ? '🔒' : '🔓'}
                                                    </Button>
                                                </Tooltip>
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
                            {editingItem ? 'Edit Jenis Surat' : 'Tambah Jenis Surat Baru'}
                        </ModalHeader>
                        <ModalBody className="space-y-4">
                            {/* Section: Identitas */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold opacity-70 border-b pb-1">Identitas Jenis Surat</h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Controller
                                        name="kode"
                                        control={control}
                                        render={({ field }) => (
                                            <TextInput
                                                label="Kode"
                                                placeholder="SK-DOM"
                                                error={errors.kode?.message}
                                                {...field}
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
                                    name="nama"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Nama Jenis Surat"
                                            placeholder="Surat Keterangan Domisili"
                                            error={errors.nama?.message}
                                            {...field}
                                        />
                                    )}
                                />

                                <Controller
                                    name="deskripsi"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            label="Deskripsi"
                                            placeholder="Deskripsi singkat tentang jenis surat ini..."
                                            error={errors.deskripsi?.message}
                                            rows={2}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>

                            {/* Section: Pengaturan */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold opacity-70 border-b pb-1">Pengaturan</h3>

                                <Controller
                                    name="is_active"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Jenis surat aktif"
                                            desc="Jenis surat dapat digunakan untuk membuat surat"
                                            checked={field.value ?? true}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />

                                <Controller
                                    name="bisa_diajukan_warga"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Dapat diajukan oleh warga"
                                            desc="Warga dapat mengajukan surat ini secara online"
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
                    <ModalHeader>Hapus Jenis Surat</ModalHeader>
                    <ModalBody>
                        <p>Yakin ingin menghapus jenis surat <strong>{deletingItem?.nama}</strong>?</p>
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
