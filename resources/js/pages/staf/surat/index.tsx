import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    TextInput,
    Textarea,
    SelectInput,
    DatePickerInput,
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
import { suratSchema, defaultValues, type SuratFormValues } from './schema';
import { formatDate, formatDateShort, parseDate, toDateString } from '@/lib/date';

// ── Types ──────────────────────────────────────────────────

interface JenisSurat {
    id: number;
    kode: string;
    nama: string;
    template_fields: Record<string, unknown> | null;
}

interface Penduduk {
    id: number;
    nik: string;
    nama_lengkap: string;
}

interface Surat {
    id: number;
    nomor_surat: string;
    jenis_surat_id: number;
    penduduk_id: number;
    perihal: string;
    keterangan: string | null;
    status: string;
    tanggal_surat: string;
    ditandatangani_oleh: string | null;
    jabatan_penandatangan: string | null;
    created_at: string;
    jenis_surat?: JenisSurat | null;
    penduduk?: Penduduk | null;
}

interface PaginatedData {
    data: Surat[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    surat: PaginatedData;
    filters: { search: string; status: string; jenis: string };
    jenisSurat: JenisSurat[];
    pendudukList: Penduduk[];
}

// ── Constants ──────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: '', label: 'Semua Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'diterbitkan', label: 'Diterbitkan' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
];

const STATUS_COLORS: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
    draft: 'info',
    diterbitkan: 'success',
    dibatalkan: 'error',
};

export default function Index({ surat, filters, jenisSurat, pendudukList }: Props) {
    // ── Search & Filter State ───────────────────────────────
    const [search, setSearch] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status);
    const [jenisFilter, setJenisFilter] = useState(filters.jenis);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Surat | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBatalkanOpen, setIsBatalkanOpen] = useState(false);
    const [batalkanItem, setBatalkanItem] = useState<Surat | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<Surat | null>(null);
    const [isTerbitkanOpen, setIsTerbitkanOpen] = useState(false);
    const [terbitkanItem, setTerbitkanItem] = useState<Surat | null>(null);

    const { control, handleSubmit, reset, setError, formState: { errors } } = useForm<SuratFormValues>({
        resolver: yupResolver(suratSchema),
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

    const doSearch = useCallback((keyword: string, status?: string, jenis?: string) => {
        router.get('/staf/surat', {
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

    const openCreate = useCallback(() => {
        setEditingItem(null);
        reset({
            ...defaultValues,
            tanggal_surat: toDateString(new Date()),
        });
        setIsFormOpen(true);
    }, [reset]);

    const openEdit = useCallback((item: Surat) => {
        setEditingItem(item);
        reset({
            jenis_surat_id: item.jenis_surat_id,
            penduduk_id: item.penduduk_id,
            perihal: item.perihal,
            keterangan: item.keterangan || '',
            data_tambahan: null,
            tanggal_surat: item.tanggal_surat,
            ditandatangani_oleh: item.ditandatangani_oleh || '',
            jabatan_penandatangan: item.jabatan_penandatangan || '',
            pengajuan_surat_id: null,
        });
        setIsFormOpen(true);
    }, [reset]);

    const closeForm = useCallback(() => setIsFormOpen(false), []);

    // ── Form Submit ────────────────────────────────────────

    const onSubmit = useCallback((values: SuratFormValues) => {
        setIsSubmitting(true);
        router.post(
            editingItem ? `/staf/surat/${editingItem.id}` : '/staf/surat',
            {
                ...values,
                _method: editingItem ? 'PUT' : 'POST',
            },
            {
                onError: (serverErrors) => {
                    Object.entries(serverErrors).forEach(([field, msg]) => {
                        setError(field as keyof SuratFormValues, { type: 'server', message: msg as string });
                    });
                    showError(Object.values(serverErrors)[0] as string || 'Gagal menyimpan surat.');
                },
                onSuccess: () => closeForm(),
                onFinish: () => setIsSubmitting(false),
            }
        );
    }, [editingItem, setError, closeForm]);

    // ── Actions ─────────────────────────────────────────────

    const handleDelete = useCallback((item: Surat) => {
        setDeleteItem(item);
        setIsDeleteOpen(true);
    }, []);

    const executeDelete = useCallback(() => {
        if (!deleteItem) return;
        router.delete(`/staf/surat/${deleteItem.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeleteItem(null);
            },
            onError: () => showError('Gagal menghapus surat.'),
        });
    }, [deleteItem]);

    const handleTerbitkan = useCallback((item: Surat) => {
        setTerbitkanItem(item);
        setIsTerbitkanOpen(true);
    }, []);

    const executeTerbitkan = useCallback(() => {
        if (!terbitkanItem) return;
        router.post(`/staf/surat/${terbitkanItem.id}/terbitkan`, {}, {
            onSuccess: () => {
                setIsTerbitkanOpen(false);
                setTerbitkanItem(null);
            },
            onError: () => showError('Gagal menerbitkan surat.'),
        });
    }, [terbitkanItem]);

    const handleBatalkan = useCallback((item: Surat) => {
        setBatalkanItem(item);
        setIsBatalkanOpen(true);
    }, []);

    const executeBatalkan = useCallback(() => {
        if (!batalkanItem) return;
        router.post(`/staf/surat/${batalkanItem.id}/batalkan`, {}, {
            onSuccess: () => {
                setIsBatalkanOpen(false);
                setBatalkanItem(null);
            },
            onError: () => showError('Gagal membatalkan surat.'),
        });
    }, [batalkanItem]);

    // ── Helpers ─────────────────────────────────────────────

    const formJenisOptions = jenisSurat.map((j) => ({
        value: String(j.id),
        label: `${j.kode} - ${j.nama}`,
    }));

    const formPendudukOptions = pendudukList.map((p) => ({
        value: String(p.id),
        label: `${p.nik} - ${p.nama_lengkap}`,
    }));

    // ── Render ─────────────────────────────────────────────
    return (
        <StafLayout
            title="Manajemen Surat"
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Surat' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Surat</h1>
                        <p className="text-sm opacity-70">Kelola surat-surat kelurahan</p>
                    </div>
                    <Button color="primary" onClick={openCreate}>
                        + Buat Surat
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
                                    placeholder="Cari nomor surat, perihal, atau nama penduduk..."
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
                            Menampilkan {surat.from ?? 0}–{surat.to ?? 0} dari {surat.total} surat
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow overflow-x-auto">
                    <Table className="table-sm">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>No</TableHeaderCell>
                                <TableHeaderCell>Nomor Surat</TableHeaderCell>
                                <TableHeaderCell>Jenis</TableHeaderCell>
                                <TableHeaderCell>Penduduk</TableHeaderCell>
                                <TableHeaderCell>Perihal</TableHeaderCell>
                                <TableHeaderCell>Tanggal</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell className="text-center">Aksi</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {surat.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        <div className="text-sm opacity-50">Belum ada data surat</div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                surat.data.map((item, idx) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{(surat.current_page - 1) * surat.per_page + idx + 1}</TableCell>
                                        <TableCell>
                                            <div className="font-mono text-sm">{item.nomor_surat}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{item.jenis_surat?.kode}</div>
                                                <div className="text-xs opacity-50">{item.jenis_surat?.nama}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{item.penduduk?.nama_lengkap}</div>
                                                <div className="text-xs opacity-50 font-mono">{item.penduduk?.nik}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm max-w-xs truncate">{item.perihal}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{formatDateShort(item.tanggal_surat)}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge color={STATUS_COLORS[item.status] || 'info'} size="sm">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                {item.status === 'draft' && (
                                                    <Tooltip content="Terbitkan">
                                                        <Button
                                                            size="sm"
                                                            color="success"
                                                            variant="soft"
                                                            circle
                                                            onClick={() => handleTerbitkan(item)}
                                                            title="Terbitkan Surat"
                                                        >
                                                            ✅
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                {item.status !== 'dibatalkan' && (
                                                    <Tooltip content="Batalkan">
                                                        <Button
                                                            size="sm"
                                                            color="error"
                                                            variant="soft"
                                                            circle
                                                            onClick={() => handleBatalkan(item)}
                                                            title="Batalkan Surat"
                                                        >
                                                            🚫
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                {item.status === 'diterbitkan' && (
                                                    <Tooltip content="Cetak PDF">
                                                        <a
                                                            href={`/staf/surat/${item.id}/cetak`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Cetak PDF"
                                                        >
                                                            <Button
                                                                size="sm"
                                                                color="info"
                                                                variant="soft"
                                                                circle
                                                                title="Cetak PDF"
                                                            >
                                                                📄
                                                            </Button>
                                                        </a>
                                                    </Tooltip>
                                                )}
                                                {item.status === 'draft' && (
                                                    <>
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
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <LaravelPagination data={surat} size="sm" />

                {/* Form Modal */}
                <Modal open={isFormOpen} onClose={closeForm} boxClassName="max-w-3xl w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader>
                            {editingItem ? 'Edit Surat' : 'Buat Surat Baru'}
                        </ModalHeader>
                        <ModalBody className="space-y-4">
                            {/* Section: Identitas Surat */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold opacity-70 border-b pb-1">Identitas Surat</h3>

                                <Controller
                                    name="jenis_surat_id"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectInput
                                            label="Jenis Surat"
                                            options={formJenisOptions}
                                            placeholder="Pilih jenis surat"
                                            error={errors.jenis_surat_id?.message}
                                            value={formJenisOptions.find(o => o.value === String(field.value))}
                                            onChange={(val) => field.onChange(val ? Number(val.value) : null)}
                                        />
                                    )}
                                />

                                <Controller
                                    name="tanggal_surat"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePickerInput
                                            label="Tanggal Surat"
                                            selected={parseDate(field.value)}
                                            onChange={(date) => field.onChange(toDateString(date))}
                                            error={errors.tanggal_surat?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="perihal"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Perihal"
                                            error={errors.perihal?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>

                            {/* Section: Penduduk */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold opacity-70 border-b pb-1">Penduduk</h3>

                                <Controller
                                    name="penduduk_id"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectInput
                                            label="Penduduk"
                                            options={formPendudukOptions}
                                            placeholder="Cari dan pilih penduduk..."
                                            error={errors.penduduk_id?.message}
                                            value={formPendudukOptions.find(o => o.value === String(field.value))}
                                            onChange={(val) => field.onChange(val ? Number(val.value) : null)}
                                        />
                                    )}
                                />
                            </div>

                            {/* Section: Keterangan & Penandatangan */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold opacity-70 border-b pb-1">Keterangan & Penandatangan</h3>

                                <Controller
                                    name="keterangan"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            label="Keterangan"
                                            error={errors.keterangan?.message}
                                            rows={3}
                                            {...field}
                                        />
                                    )}
                                />

                                <Controller
                                    name="ditandatangani_oleh"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Ditandatangani Oleh"
                                            error={errors.ditandatangani_oleh?.message}
                                            {...field}
                                        />
                                    )}
                                />

                                <Controller
                                    name="jabatan_penandatangan"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Jabatan Penandatangan"
                                            error={errors.jabatan_penandatangan?.message}
                                            {...field}
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
                                {editingItem ? 'Simpan Perubahan' : 'Buat Surat'}
                            </Button>
                        </ModalAction>
                    </form>
                </Modal>

                {/* Batalkan Modal */}
                <Modal open={isBatalkanOpen} onClose={() => setIsBatalkanOpen(false)}>
                    <ModalHeader>Batalkan Surat</ModalHeader>
                    <ModalBody>
                        <p>Yakin ingin membatalkan surat <strong>{batalkanItem?.nomor_surat || '-'}</strong>?</p>
                        <p className="text-sm text-error mt-2">Tindakan ini tidak dapat dibatalkan. Status surat akan diubah menjadi "Dibatalkan".</p>
                    </ModalBody>
                    <ModalAction>
                        <Button color="ghost" onClick={() => setIsBatalkanOpen(false)}>Batal</Button>
                        <Button color="error" onClick={executeBatalkan}>Ya, Batalkan</Button>
                    </ModalAction>
                </Modal>

                {/* Delete Modal */}
                <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                    <ModalHeader>Hapus Surat</ModalHeader>
                    <ModalBody>
                        <p>Yakin ingin menghapus surat <strong>{deleteItem?.nomor_surat || '-'}</strong>?</p>
                        <p className="text-sm text-error mt-2">Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen dari sistem.</p>
                    </ModalBody>
                    <ModalAction>
                        <Button color="ghost" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
                        <Button color="error" onClick={executeDelete}>Ya, Hapus</Button>
                    </ModalAction>
                </Modal>

                {/* Terbitkan Modal */}
                <Modal open={isTerbitkanOpen} onClose={() => setIsTerbitkanOpen(false)}>
                    <ModalHeader>Terbitkan Surat</ModalHeader>
                    <ModalBody>
                        <p>Yakin ingin menerbitkan surat <strong>{terbitkanItem?.nomor_surat || '-'}</strong>?</p>
                        <p className="text-sm text-info mt-2">Status surat akan diubah menjadi "Diterbitkan" dan siap untuk dicetak.</p>
                    </ModalBody>
                    <ModalAction>
                        <Button color="ghost" onClick={() => setIsTerbitkanOpen(false)}>Batal</Button>
                        <Button color="success" onClick={executeTerbitkan}>Ya, Terbitkan</Button>
                    </ModalAction>
                </Modal>
            </div>
        </StafLayout>
    );
}
