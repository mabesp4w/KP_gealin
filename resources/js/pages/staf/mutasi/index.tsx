import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    TextInput,
    Textarea,
    DatePickerInput,
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
import { mutasiSchema, defaultValues, type MutasiFormValues } from './schema';

/** Parse "YYYY-MM-DD" or ISO string to Date, returns null if invalid */
const parseDate = (v: string | null | undefined): Date | null => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
};

/** Format Date to "YYYY-MM-DD" string for backend */
const formatDate = (d: Date | null): string => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

// ── Types ──────────────────────────────────────────────────

interface SelectOption {
    label: string;
    value: string;
}

interface Penduduk {
    id: number;
    nik: string;
    nama_lengkap: string;
    status_penduduk: string;
}

interface MutasiPenduduk {
    id: number;
    penduduk_id: number;
    jenis_mutasi: 'masuk' | 'keluar' | 'meninggal' | 'lahir';
    tanggal_mutasi: string;
    asal_tujuan: string | null;
    alasan: string | null;
    keterangan: string | null;
    created_at: string;
    penduduk: {
        id: number;
        nik: string;
        nama_lengkap: string;
    };
}

interface PaginatedData {
    data: MutasiPenduduk[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    mutasi: PaginatedData;
    filters: { search: string; jenis: string };
    penduduk: Penduduk[];
}

// ── Jenis Mutasi Options ───────────────────────────────────

const JENIS_MUTASI_OPTIONS = [
    { label: 'Masuk', value: 'masuk' },
    { label: 'Keluar', value: 'keluar' },
    { label: 'Meninggal', value: 'meninggal' },
    { label: 'Lahir', value: 'lahir' },
];

const JENIS_MUTASI_COLORS: Record<string, { color: string; label: string }> = {
    masuk: { color: 'success', label: 'Masuk' },
    keluar: { color: 'warning', label: 'Keluar' },
    meninggal: { color: 'error', label: 'Meninggal' },
    lahir: { color: 'info', label: 'Lahir' },
};

// ── Component ──────────────────────────────────────────────

export default function MutasiIndex({ mutasi, filters, penduduk }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [jenisFilter, setJenisFilter] = useState(filters.jenis);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MutasiPenduduk | null>(null);
    const [deletingItem, setDeletingItem] = useState<MutasiPenduduk | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<MutasiFormValues>({
        resolver: yupResolver(mutasiSchema),
        defaultValues,
    });

    useEffect(() => {
        setSearch(filters.search);
        setJenisFilter(filters.jenis);
    }, [filters.search, filters.jenis]);

    useEffect(() => {
        if (!isFormOpen) {
            reset(defaultValues);
            setEditingItem(null);
        }
    }, [isFormOpen, reset]);

    // ── Search (debounced auto-search) ──────────────────────

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const doSearch = useCallback((keyword: string, jenis: string) => {
        router.get('/staf/mutasi', {
            search: keyword.trim() || undefined,
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
        debounceRef.current = setTimeout(() => doSearch(value, jenisFilter), 300);
    };

    const handleJenisChange = (value: string) => {
        setJenisFilter(value);
        doSearch(search, value);
    };

    // ── Modal handlers ─────────────────────────────────────

    const openCreate = () => {
        setEditingItem(null);
        reset(defaultValues);
        setIsFormOpen(true);
    };

    const openEdit = (item: MutasiPenduduk) => {
        setEditingItem(item);
        reset({
            penduduk_id: item.penduduk_id,
            jenis_mutasi: item.jenis_mutasi,
            tanggal_mutasi: item.tanggal_mutasi,
            asal_tujuan: item.asal_tujuan,
            alasan: item.alasan,
            keterangan: item.keterangan,
        });
        setIsFormOpen(true);
    };

    const openDelete = (item: MutasiPenduduk) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    // ── Submit ──────────────────────────────────────────────

    const onSubmit = (values: MutasiFormValues) => {
        setIsSubmitting(true);
        const url = editingItem ? `/staf/mutasi/${editingItem.id}` : '/staf/mutasi';

        const options = {
            preserveScroll: true,
            onError: (serverErrors: Record<string, string>) => {
                let firstMsg = '';
                Object.entries(serverErrors).forEach(([field, message]) => {
                    if (!firstMsg) firstMsg = message;
                    setError(field as keyof MutasiFormValues, { type: 'server', message });
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

    const handleDelete = () => {
        if (!deletingItem) return;
        router.delete(`/staf/mutasi/${deletingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingItem(null);
            },
            onError: () => showError('Gagal menghapus data.'),
        });
    };

    // Filter penduduk options (exclude those with certain status if needed)
    const pendudukOptions = penduduk.map((p) => ({
        label: `${p.nik} - ${p.nama_lengkap}`,
        value: p.id.toString(),
    }));

    return (
        <StafLayout
            title="Mutasi Penduduk"
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Mutasi Penduduk' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mutasi Penduduk</h1>
                        <p className="text-base-content/60 mt-1">Kelola data mutasi penduduk Kelurahan Ardipura</p>
                    </div>
                    <Button color="primary" onClick={openCreate}>
                        + Tambah Mutasi
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
                                    placeholder="Cari nama penduduk, NIK, asal/tujuan..."
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
                            <select className="select sm:w-44" value={jenisFilter} onChange={(e) => handleJenisChange(e.target.value)}>
                                <option value="">Semua Jenis</option>
                                {JENIS_MUTASI_OPTIONS.map((j) => <option key={j.value} value={j.value}>{j.label}</option>)}
                            </select>
                            {jenisFilter && (
                                <button type="button" className="btn btn-ghost btn-xs" onClick={() => handleJenisChange('')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reset
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-base-content/50 mt-2">
                            Menampilkan {mutasi.from ?? 0}–{mutasi.to ?? 0} dari {mutasi.total} data mutasi
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow overflow-x-auto">
                    <Table className="table-sm">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>No</TableHeaderCell>
                                <TableHeaderCell>Penduduk</TableHeaderCell>
                                <TableHeaderCell>Jenis Mutasi</TableHeaderCell>
                                <TableHeaderCell>Tanggal</TableHeaderCell>
                                <TableHeaderCell className="hidden md:table-cell">Asal/Tujuan</TableHeaderCell>
                                <TableHeaderCell className="hidden lg:table-cell">Alasan</TableHeaderCell>
                                <TableHeaderCell className="text-center">Aksi</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mutasi.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-base-content/50">
                                        Belum ada data mutasi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mutasi.data.map((item, i) => {
                                    const jenisInfo = JENIS_MUTASI_COLORS[item.jenis_mutasi] ?? { color: 'neutral', label: item.jenis_mutasi };
                                    return (
                                        <TableRow key={item.id} className="hover">
                                            <TableCell>{(mutasi.from ?? 1) + i}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{item.penduduk.nama_lengkap}</div>
                                                <div className="text-xs text-base-content/50 font-mono">{item.penduduk.nik}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge color={jenisInfo.color as any} size="sm">
                                                    {jenisInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(item.tanggal_mutasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-xs">
                                                {item.asal_tujuan || '—'}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-xs">
                                                {item.alasan || '—'}
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

                <LaravelPagination data={mutasi} />
            </div>

            {/* ── Form Modal ──────────────────────────────── */}
            <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)} boxClassName="max-w-2xl w-full">
                <ModalHeader>{editingItem ? 'Edit Mutasi Penduduk' : 'Tambah Mutasi Penduduk'}</ModalHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody className="max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            {/* Penduduk */}
                            <Controller name="penduduk_id" control={control} render={({ field }) => (
                                <SelectInput<SelectOption>
                                    label="Penduduk"
                                    options={pendudukOptions}
                                    placeholder="Pilih Penduduk"
                                    value={pendudukOptions.find((o) => o.value === field.value?.toString()) ?? null}
                                    onChange={(selected) => field.onChange(selected?.value ? parseInt(selected.value, 10) : 0)}
                                    error={errors.penduduk_id?.message}
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        menu: (provided) => ({
                                            ...provided,
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '1rem',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        }),
                                        menuList: (provided) => ({
                                            ...provided,
                                            backgroundColor: '#ffffff',
                                            borderRadius: '1rem',
                                            padding: '0.25rem',
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#d1fae5' : 'transparent',
                                            color: state.isSelected ? '#ffffff' : '#1f2937',
                                            cursor: 'pointer',
                                        }),
                                    }}
                                />
                            )} />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Jenis Mutasi */}
                                <Controller name="jenis_mutasi" control={control} render={({ field }) => (
                                    <SelectInput<SelectOption>
                                        label="Jenis Mutasi"
                                        options={JENIS_MUTASI_OPTIONS}
                                        placeholder="Pilih Jenis"
                                        value={JENIS_MUTASI_OPTIONS.find((j) => j.value === field.value) ?? null}
                                        onChange={(selected) => field.onChange(selected?.value ?? '')}
                                        error={errors.jenis_mutasi?.message}
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            menu: (provided) => ({
                                                ...provided,
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '1rem',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            }),
                                            menuList: (provided) => ({
                                                ...provided,
                                                backgroundColor: '#ffffff',
                                                borderRadius: '1rem',
                                                padding: '0.25rem',
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#d1fae5' : 'transparent',
                                                color: state.isSelected ? '#ffffff' : '#1f2937',
                                                cursor: 'pointer',
                                            }),
                                        }}
                                    />
                                )} />

                                {/* Tanggal Mutasi */}
                                <Controller name="tanggal_mutasi" control={control} render={({ field }) => (
                                    <DatePickerInput
                                        label="Tanggal Mutasi"
                                        selected={parseDate(field.value)}
                                        onChange={(date) => field.onChange(formatDate(date))}
                                        error={errors.tanggal_mutasi?.message}
                                        placeholder="Pilih tanggal"
                                        required
                                    />
                                )} />
                            </div>

                            {/* Asal/Tujuan - conditional based on jenis mutasi */}
                            <Controller
                                name="jenis_mutasi"
                                control={control}
                                render={({ field }) => {
                                    const isMasuk = field.value === 'masuk';
                                    const isKeluar = field.value === 'keluar';
                                    if (!isMasuk && !isKeluar) return null;
                                    return (
                                        <Controller name="asal_tujuan" control={control} render={({ field: asalField }) => (
                                            <TextInput
                                                label={isMasuk ? 'Asal' : 'Tujuan'}
                                                placeholder={isMasuk ? 'Asal penduduk datang' : 'Tujuan penduduk pindah'}
                                                {...asalField}
                                                value={asalField.value ?? ''}
                                                error={errors.asal_tujuan?.message}
                                            />
                                        )} />
                                    );
                                }}
                            />

                            {/* Alasan */}
                            <Controller name="alasan" control={control} render={({ field }) => (
                                <Textarea
                                    label="Alasan"
                                    placeholder="Jelaskan alasan mutasi..."
                                    {...field}
                                    value={field.value ?? ''}
                                    error={errors.alasan?.message}
                                    rows={2}
                                />
                            )} />

                            {/* Keterangan */}
                            <Controller name="keterangan" control={control} render={({ field }) => (
                                <Textarea
                                    label="Keterangan Tambahan"
                                    placeholder="Keterangan tambahan (opsional)"
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
                            {editingItem ? 'Simpan Perubahan' : 'Tambah Mutasi'}
                        </Button>
                    </ModalAction>
                </form>
            </Modal>

            {/* ── Delete Modal ─────────────────────────────── */}
            <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <ModalHeader>Hapus Data Mutasi</ModalHeader>
                <ModalBody>
                    <p>Yakin ingin menghapus data mutasi untuk <strong>{deletingItem?.penduduk.nama_lengkap}</strong>?</p>
                    {deletingItem && (
                        <div className="mt-2 p-3 bg-base-200 rounded-lg">
                            <p className="text-sm">
                                <span className="font-medium">Jenis:</span> {JENIS_MUTASI_COLORS[deletingItem.jenis_mutasi]?.label || deletingItem.jenis_mutasi}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Tanggal:</span> {new Date(deletingItem.tanggal_mutasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    )}
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
