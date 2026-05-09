import { router } from '@inertiajs/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { pengajuanSchema, defaultValues, type PengajuanFormValues, statusUpdateSchema, type StatusUpdateFormValues } from './schema';
import {
    Button,
    Textarea,
    SelectInput,
    NativeSelect,
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
    LaravelPagination,
    showError,
    Tooltip,
} from '@/components/ui';
import StafLayout from '@/layouts/StafLayout';
import { formatDateShort } from '@/lib/date';

// ── Types ──────────────────────────────────────────────────

interface SelectOption {
    label: string;
    value: string;
}

interface JenisSurat {
    id: number;
    kode: string;
    nama: string;
}

interface Penduduk {
    id: number;
    nik: string;
    nama_lengkap: string;
}

interface PengajuanSurat {
    id: number;
    penduduk_id: number;
    jenis_surat_id: number;
    user_id: number;
    keperluan: string;
    keterangan: string | null;
    status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak';
    catatan_staf: string | null;
    tanggal_diproses: string | null;
    created_at: string;
    penduduk: {
        id: number;
        nik: string;
        nama_lengkap: string;
    };
    jenisSurat?: {
        id: number;
        kode: string;
        nama: string;
    } | null;
    user: {
        id: number;
        name: string;
        email: string;
    };
    lampiran?: {
        id: number;
        nama_file: string;
        path_file: string;
        tipe_file: string;
        persyaratan_nama: string;
    }[];
}

interface PaginatedData {
    data: PengajuanSurat[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    pengajuan: PaginatedData;
    filters: { search: string; status: string; jenis: string };
    jenisSurat: JenisSurat[];
    penduduk: Penduduk[];
}

// ── Status Options ───────────────────────────────────────────

const STATUS_OPTIONS = [
    { label: 'Menunggu', value: 'menunggu' },
    { label: 'Diproses', value: 'diproses' },
    { label: 'Selesai', value: 'selesai' },
    { label: 'Ditolak', value: 'ditolak' },
];

const STATUS_COLORS: Record<string, { color: string; label: string }> = {
    menunggu: { color: 'warning', label: 'Menunggu' },
    diproses: { color: 'info', label: 'Diproses' },
    selesai: { color: 'success', label: 'Selesai' },
    ditolak: { color: 'error', label: 'Ditolak' },
};

// ── Component ──────────────────────────────────────────────

export default function PengajuanIndex({ pengajuan, filters, jenisSurat, penduduk }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status);
    const [jenisFilter, setJenisFilter] = useState(filters.jenis);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PengajuanSurat | null>(null);
    const [deletingItem, setDeletingItem] = useState<PengajuanSurat | null>(null);
    const [statusItem, setStatusItem] = useState<PengajuanSurat | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<PengajuanFormValues>({
        resolver: yupResolver(pengajuanSchema),
        defaultValues,
    });

    const statusControl = useForm<StatusUpdateFormValues>({
        resolver: yupResolver(statusUpdateSchema),
        defaultValues: {
            status: 'menunggu',
            catatan_staf: null,
        },
    });

    useEffect(() => {
        setSearch(filters.search);
        setStatusFilter(filters.status);
        setJenisFilter(filters.jenis);
    }, [filters.search, filters.status, filters.jenis]);

    useEffect(() => {
        if (!isFormOpen) {
            reset(defaultValues);
            setEditingItem(null);
        }
    }, [isFormOpen, reset]);

    // ── Search (debounced auto-search) ──────────────────────

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const doSearch = useCallback((keyword: string, status: string, jenis: string) => {
        router.get('/staf/pengajuan', {
            search: keyword.trim() || undefined,
            status: status || undefined,
            jenis: jenis || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, []);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value, statusFilter, jenisFilter), 300);
    };

    const handleFilterChange = (type: 'status' | 'jenis', value: string) => {
        if (type === 'status') setStatusFilter(value);
        else setJenisFilter(value);
        doSearch(search, type === 'status' ? value : statusFilter, type === 'jenis' ? value : jenisFilter);
    };

    // ── Modal handlers ─────────────────────────────────────

    const openCreate = () => {
        setEditingItem(null);
        reset(defaultValues);
        setIsFormOpen(true);
    };

    const openEdit = (item: PengajuanSurat) => {
        setEditingItem(item);
        reset({
            penduduk_id: item.penduduk_id,
            jenis_surat_id: item.jenis_surat_id,
            keperluan: item.keperluan,
            keterangan: item.keterangan,
            data_tambahan: null,
        });
        setIsFormOpen(true);
    };

    const openStatusModal = (item: PengajuanSurat) => {
        setStatusItem(item);
        statusControl.reset({
            status: item.status,
            catatan_staf: item.catatan_staf,
        });
        setIsStatusModalOpen(true);
    };

    const openDelete = (item: PengajuanSurat) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    // ── Submit ──────────────────────────────────────────────

    const onSubmit = (values: PengajuanFormValues) => {
        setIsSubmitting(true);
        const url = editingItem ? `/staf/pengajuan/${editingItem.id}` : '/staf/pengajuan';

        const options = {
            preserveScroll: true,
            onError: (serverErrors: Record<string, string>) => {
                let firstMsg = '';
                Object.entries(serverErrors).forEach(([field, message]) => {
                    if (!firstMsg) firstMsg = message;
                    setError(field as keyof PengajuanFormValues, { type: 'server', message });
                });
                showError(firstMsg || 'Gagal menyimpan. Periksa kembali form.');
            },
            onSuccess: () => {
                setIsFormOpen(false);
            },
            onFinish: () => setIsSubmitting(false),
        };

        if (editingItem) {
            router.put(url, values as any, options);
        } else {
            router.post(url, values as any, options);
        }
    };

    const handleStatusUpdate = (values: StatusUpdateFormValues) => {
        if (!statusItem) return;
        router.patch(`/staf/pengajuan/${statusItem.id}/status`, values, {
            preserveScroll: true,
            onSuccess: () => {
                setIsStatusModalOpen(false);
                setStatusItem(null);
            },
            onError: () => showError('Gagal mengupdate status.'),
        });
    };

    const handleDelete = () => {
        if (!deletingItem) return;
        router.delete(`/staf/pengajuan/${deletingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingItem(null);
            },
            onError: () => showError('Gagal menghapus data.'),
        });
    };

    // Format options
    const jenisSuratOptions = jenisSurat.map((j) => ({
        label: `${j.kode} - ${j.nama}`,
        value: j.id.toString(),
    }));

    const pendudukOptions = penduduk.map((p) => ({
        label: `${p.nik} - ${p.nama_lengkap}`,
        value: p.id.toString(),
    }));

    return (
        <StafLayout
            title="Pengajuan Surat"
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Pengajuan Surat' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Pengajuan Surat</h1>
                        <p className="text-base-content/60 mt-1">Kelola pengajuan surat dari warga</p>
                    </div>
                    <Button color="primary" onClick={openCreate}>
                        + Buat Pengajuan
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
                                    placeholder="Cari nama, NIK, keperluan..."
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
                            <select className="select sm:w-40" value={statusFilter} onChange={(e) => handleFilterChange('status', e.target.value)}>
                                <option value="">Semua Status</option>
                                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            <select className="select sm:w-48" value={jenisFilter} onChange={(e) => handleFilterChange('jenis', e.target.value)}>
                                <option value="">Semua Jenis</option>
                                {jenisSurat.map((j) => <option key={j.id} value={j.id.toString()}>{j.kode} - {j.nama}</option>)}
                            </select>
                            {(statusFilter || jenisFilter) && (
                                <button type="button" className="btn btn-ghost btn-xs" onClick={() => { handleFilterChange('status', ''); handleFilterChange('jenis', ''); }}>
                                    Reset Filter
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-base-content/50 mt-2">
                            Menampilkan {pengajuan.from ?? 0}–{pengajuan.to ?? 0} dari {pengajuan.total} pengajuan
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow overflow-x-auto">
                    <Table className="table-sm">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>No</TableHeaderCell>
                                <TableHeaderCell>Pemohon</TableHeaderCell>
                                <TableHeaderCell>Jenis Surat</TableHeaderCell>
                                <TableHeaderCell>Keperluan</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell className="hidden md:table-cell">Tanggal</TableHeaderCell>
                                <TableHeaderCell className="text-center">Aksi</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pengajuan.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-base-content/50">
                                        Belum ada data pengajuan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pengajuan.data.map((item, i) => {
                                    const statusInfo = STATUS_COLORS[item.status] ?? { color: 'neutral', label: item.status };
                                    return (
                                        <TableRow key={item.id} className="hover">
                                            <TableCell>{(pengajuan.from ?? 1) + i}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{item.penduduk.nama_lengkap}</div>
                                                <div className="text-xs text-base-content/50 font-mono">{item.penduduk.nik}</div>
                                            </TableCell>
                                            <TableCell>
                                                {item.jenisSurat ? (
                                                    <>
                                                        <div className="text-xs">{item.jenisSurat.kode}</div>
                                                        <div className="font-medium text-sm">{item.jenisSurat.nama}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-error text-sm">Jenis surat tidak ditemukan</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{item.keperluan}</TableCell>
                                            <TableCell>
                                                <Badge color={statusInfo.color as any} size="sm">
                                                    {statusInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-xs">
                                                {formatDateShort(item.created_at)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    <Tooltip content="Update Status">
                                                        <Button
                                                            size="sm"
                                                            color="info"
                                                            variant="soft"
                                                            circle
                                                            onClick={() => openStatusModal(item)}
                                                            title="Update Status"
                                                        >
                                                            📋
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
                                                            onClick={() => openDelete(item)}
                                                            title="Hapus Data"
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                <LaravelPagination data={pengajuan} />
            </div>

            {/* Form Modal */}
            <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)} boxClassName="max-w-2xl w-full">
                <ModalHeader>{editingItem ? 'Edit Pengajuan Surat' : 'Buat Pengajuan Surat'}</ModalHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody className="max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller name="penduduk_id" control={control} render={({ field }) => (
                                    <SelectInput<SelectOption>
                                        label="Penduduk"
                                        options={pendudukOptions}
                                        placeholder="Pilih Penduduk"
                                        value={pendudukOptions.find((o) => o.value === field.value?.toString()) ?? null}
                                        onChange={(selected) => field.onChange(selected?.value ? parseInt(selected.value, 10) : 0)}
                                        error={errors.penduduk_id?.message}
                                        menuPlacement="bottom"
                                        menuShouldScrollIntoView={false}
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        }}
                                    />
                                )} />
                                <Controller name="jenis_surat_id" control={control} render={({ field }) => (
                                    <SelectInput<SelectOption>
                                        label="Jenis Surat"
                                        options={jenisSuratOptions}
                                        placeholder="Pilih Jenis Surat"
                                        value={jenisSuratOptions.find((o) => o.value === field.value?.toString()) ?? null}
                                        onChange={(selected) => field.onChange(selected?.value ? parseInt(selected.value, 10) : 0)}
                                        error={errors.jenis_surat_id?.message}
                                        menuPlacement="bottom"
                                        menuShouldScrollIntoView={false}
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        }}
                                    />
                                )} />
                            </div>
                            <Controller name="keperluan" control={control} render={({ field }) => (
                                <Textarea
                                    label="Keperluan"
                                    placeholder="Jelaskan keperluan pengajuan surat..."
                                    {...field}
                                    error={errors.keperluan?.message}
                                    rows={2}
                                />
                            )} />
                            <Controller name="keterangan" control={control} render={({ field }) => (
                                <Textarea
                                    label="Keterangan Tambahan"
                                    placeholder="Keterangan tambahan - opsional"
                                    {...field}
                                    value={field.value ?? ''}
                                    error={errors.keterangan?.message}
                                    rows={2}
                                />
                            )} />
                        </div>
                    </ModalBody>
                    <ModalAction>
                        <Button type="button" color="ghost" onClick={() => setIsFormOpen(false)}>Batal</Button>
                        <Button type="submit" color="primary" loading={isSubmitting}>
                            {editingItem ? 'Simpan Perubahan' : 'Buat Pengajuan'}
                        </Button>
                    </ModalAction>
                </form>
            </Modal>

            {/* Status Update Modal */}
            <Modal open={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}>
                <ModalHeader>Update Status Pengajuan</ModalHeader>
                {statusItem && (
                    <form onSubmit={statusControl.handleSubmit(handleStatusUpdate)}>
                        <ModalBody className="max-h-[70vh] overflow-y-auto">
                            <div className="space-y-4">
                                {/* Info Pengajuan */}
                                <div className="p-3 bg-base-200 rounded-lg">
                                    <p className="text-sm"><span className="font-medium">Pemohon:</span> {statusItem.penduduk.nama_lengkap}</p>
                                    <p className="text-sm"><span className="font-medium">Jenis:</span> {statusItem.jenisSurat?.nama || 'Tidak ditemukan'}</p>
                                    <p className="text-sm"><span className="font-medium">Keperluan:</span> {statusItem.keperluan}</p>
                                </div>

                                {/* Berkas yang Diupload */}
                                {statusItem.lampiran && statusItem.lampiran.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            Berkas yang Diupload
                                            <span className="badge badge-sm badge-ghost">({statusItem.lampiran.length})</span>
                                        </div>
                                        <div className="grid gap-2">
                                            {statusItem.lampiran.map((file) => (
                                                <a
                                                    key={file.id}
                                                    href={`/storage/${file.path_file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                                                >
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                                                        {file.tipe_file === 'KTP' && '🪪'}
                                                        {file.tipe_file === 'KK' && '👨‍👩‍👧‍👦'}
                                                        {file.tipe_file === 'Foto' && '📷'}
                                                        {file.tipe_file === 'pdf' && '📕'}
                                                        {!['KTP', 'KK', 'Foto', 'pdf'].includes(file.tipe_file) && '📄'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium truncate">{file.persyaratan_nama}</div>
                                                        <div className="text-xs text-base-content/60 truncate">{file.nama_file}</div>
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <Controller name="status" control={statusControl.control} render={({ field }) => (
                                    <NativeSelect
                                        label="Status"
                                        options={STATUS_OPTIONS}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={statusControl.formState.errors.status?.message}
                                    />
                                )} />
                                <Controller name="catatan_staf" control={statusControl.control} render={({ field }) => (
                                    <Textarea
                                        label="Catatan Staf"
                                        placeholder="Tambahkan catatan untuk pemohon..."
                                        {...field}
                                        value={field.value ?? ''}
                                        error={statusControl.formState.errors.catatan_staf?.message}
                                        rows={3}
                                    />
                                )} />
                            </div>
                        </ModalBody>
                        <ModalAction>
                            <Button type="button" color="ghost" onClick={() => setIsStatusModalOpen(false)}>Batal</Button>
                            <Button type="submit" color="primary">
                                Update Status
                            </Button>
                        </ModalAction>
                    </form>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <ModalHeader>Hapus Pengajuan Surat</ModalHeader>
                <ModalBody>
                    <p>Yakin ingin menghapus pengajuan surat untuk <strong>{deletingItem?.penduduk.nama_lengkap}</strong>?</p>
                    <p className="text-sm text-error mt-2">Tindakan ini tidak dapat dibatalkan.</p>
                </ModalBody>
                <ModalAction>
                    <Button color="ghost" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
                    <Button color="error" onClick={handleDelete}>Hapus</Button>
                </ModalAction>
            </Modal>
        </StafLayout>
    );
}
