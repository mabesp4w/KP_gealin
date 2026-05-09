import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    TextInput,
    Textarea,
    NativeSelect,
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
    Checkbox,
} from '@/components/ui';
import StafLayout from '@/layouts/StafLayout';
import { pendudukSchema, defaultValues, type PendudukFormValues } from './schema';

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

interface KartuKeluarga {
    id: number;
    nomor_kk: string;
    alamat: string;
}

interface User {
    id: number;
    email: string;
}

interface Penduduk {
    id: number;
    nik: string;
    kartu_keluarga_id: number | null;
    nama_lengkap: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    agama: string;
    status_perkawinan: string;
    pendidikan_terakhir: string;
    pekerjaan: string;
    kewarganegaraan: string;
    golongan_darah: string | null;
    status_hubungan_keluarga: string;
    nama_ayah: string | null;
    nama_ibu: string | null;
    alamat: string;
    rt: string;
    rw: string;
    status_penduduk: string;
    telepon: string | null;
    tanggal_masuk: string | null;
    catatan: string | null;
    user_id: number | null;
    user?: User | null;
    kartu_keluarga?: KartuKeluarga | null;
}

interface PaginatedData {
    data: Penduduk[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    penduduk: PaginatedData;
    filters: { search: string; status: string };
    kartuKeluarga: KartuKeluarga[];
}

// ── Constants ──────────────────────────────────────────────

const AGAMA_OPTIONS = ['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Kepercayaan'];
const STATUS_KAWIN_OPTIONS = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'];
const PENDIDIKAN_OPTIONS = ['Tidak/Belum Sekolah', 'Belum Tamat SD', 'Tamat SD', 'SLTP', 'SLTA', 'D1/D2', 'D3', 'D4/S1', 'S2', 'S3'];
const HUBUNGAN_OPTIONS = ['Kepala Keluarga', 'Suami', 'Istri', 'Anak', 'Menantu', 'Cucu', 'Orang Tua', 'Mertua', 'Famili Lain', 'Lainnya'];
const GOLDAR_OPTIONS = [{ value: '', label: '—' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'AB', label: 'AB' }, { value: 'O', label: 'O' }];
const STATUS_PENDUDUK_OPTIONS = ['Tetap', 'Sementara', 'Pindah', 'Meninggal'];

// ── Component ──────────────────────────────────────────────

export default function PendudukIndex({ penduduk, filters, kartuKeluarga }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Penduduk | null>(null);
    const [deletingItem, setDeletingItem] = useState<Penduduk | null>(null);
    const [detailItem, setDetailItem] = useState<Penduduk | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createUser, setCreateUser] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<PendudukFormValues>({
        resolver: yupResolver(pendudukSchema),
        defaultValues,
    });

    useEffect(() => {
        setSearch(filters.search);
    }, [filters.search]);

    useEffect(() => {
        if (!isFormOpen) {
            reset(defaultValues);
            setEditingItem(null);
            setCreateUser(false);
        }
    }, [isFormOpen, reset]);

    // ── Search (debounced auto-search) ──────────────────────

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const doSearch = useCallback((keyword: string, status?: string) => {
        router.get('/staf/penduduk', {
            search: keyword.trim() || undefined,
            status: status || filters.status || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [filters.status]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value), 300);
    };

    const filterByStatus = (status: string) => {
        router.get('/staf/penduduk', { search: search.trim() || undefined, status: status || undefined }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // ── Modal handlers ─────────────────────────────────────

    const openCreate = () => {
        setEditingItem(null);
        reset(defaultValues);
        setCreateUser(false);
        setIsFormOpen(true);
    };

    const openEdit = (item: Penduduk) => {
        setEditingItem(item);
        setCreateUser(false);
        reset({
            nik: item.nik,
            kartu_keluarga_id: item.kartu_keluarga_id,
            nama_lengkap: item.nama_lengkap,
            tempat_lahir: item.tempat_lahir,
            tanggal_lahir: item.tanggal_lahir,
            jenis_kelamin: item.jenis_kelamin,
            agama: item.agama,
            status_perkawinan: item.status_perkawinan,
            pendidikan_terakhir: item.pendidikan_terakhir,
            pekerjaan: item.pekerjaan,
            kewarganegaraan: item.kewarganegaraan,
            golongan_darah: item.golongan_darah,
            status_hubungan_keluarga: item.status_hubungan_keluarga,
            nama_ayah: item.nama_ayah,
            nama_ibu: item.nama_ibu,
            alamat: item.alamat,
            rt: item.rt,
            rw: item.rw,
            status_penduduk: item.status_penduduk,
            telepon: item.telepon,
            tanggal_masuk: item.tanggal_masuk,
            catatan: item.catatan,
            create_user: false,
            user_email: null,
            user_password: null,
        });
        setIsFormOpen(true);
    };

    const openDelete = (item: Penduduk) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    const openDetail = (item: Penduduk) => {
        setDetailItem(item);
        setIsDetailOpen(true);
    };

    const handleResetPassword = () => {
        if (!detailItem) return;
        setIsResetting(true);
        router.post('/staf/penduduk/reset-password', { penduduk_id: detailItem.id }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDetailOpen(false);
            },
            onFinish: () => setIsResetting(false),
        });
    };

    // ── Submit ──────────────────────────────────────────────

    const onSubmit = (values: PendudukFormValues) => {
        setIsSubmitting(true);
        const url = editingItem ? `/staf/penduduk/${editingItem.id}` : '/staf/penduduk';

        // Only include user creation fields when creating new penduduk
        const submitData: any = { ...values };
        if (editingItem) {
            // Remove user fields when editing
            delete submitData.create_user;
            delete submitData.user_email;
            delete submitData.user_password;
        } else {
            // Include create_user flag for new penduduk
            submitData.create_user = createUser;
        }

        const options = {
            preserveScroll: true,
            onError: (serverErrors: Record<string, string>) => {
                let firstMsg = '';
                Object.entries(serverErrors).forEach(([field, message]) => {
                    if (!firstMsg) firstMsg = message;
                    setError(field as keyof PendudukFormValues, { type: 'server', message });
                });
                showError(firstMsg || 'Gagal menyimpan. Periksa kembali form.');
            },
            onSuccess: () => {
                setIsFormOpen(false);
            },
            onFinish: () => setIsSubmitting(false),
        };

        if (editingItem) {
            router.put(url, submitData, options);
        } else {
            router.post(url, submitData, options);
        }
    };

    const handleDelete = () => {
        if (!deletingItem) return;
        router.delete(`/staf/penduduk/${deletingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingItem(null);
            },
            onError: () => showError('Gagal menghapus data.'),
        });
    };

    // ── Status badge color ─────────────────────────────────

    const statusColor = (s: string) => {
        switch (s) {
            case 'Tetap': return 'success';
            case 'Sementara': return 'warning';
            case 'Pindah': return 'info';
            case 'Meninggal': return 'error';
            default: return undefined;
        }
    };

    const kkOptions = [
        { value: '', label: '— Tanpa KK —' },
        ...kartuKeluarga.map((kk) => ({
            value: String(kk.id),
            label: `${kk.nomor_kk} — ${kk.alamat}`,
        })),
    ];

    return (
        <StafLayout
            title="Penduduk"
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Penduduk' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Data Penduduk</h1>
                        <p className="text-base-content/60 mt-1">Kelola data penduduk Kelurahan Ardipura</p>
                    </div>
                    <Button color="primary" onClick={openCreate}>
                        + Tambah Penduduk
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
                                    placeholder="Cari nama, NIK, atau alamat..."
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
                            <select className="select sm:w-44" value={filters.status} onChange={(e) => filterByStatus(e.target.value)}>
                                <option value="">Semua Status</option>
                                {STATUS_PENDUDUK_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <p className="text-xs text-base-content/50 mt-2">
                            Menampilkan {penduduk.from ?? 0}–{penduduk.to ?? 0} dari {penduduk.total} penduduk
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow overflow-x-auto">
                    <Table className="table-sm">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>No</TableHeaderCell>
                                <TableHeaderCell>NIK</TableHeaderCell>
                                <TableHeaderCell>Nama Lengkap</TableHeaderCell>
                                <TableHeaderCell>L/P</TableHeaderCell>
                                <TableHeaderCell className="hidden md:table-cell">Alamat</TableHeaderCell>
                                <TableHeaderCell className="hidden lg:table-cell">No. KK</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell className="hidden sm:table-cell">Akun</TableHeaderCell>
                                <TableHeaderCell className="text-center">Aksi</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {penduduk.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-12 text-base-content/50">
                                        Belum ada data penduduk.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                penduduk.data.map((item, i) => (
                                    <TableRow key={item.id} className="hover">
                                        <TableCell>{(penduduk.from ?? 1) + i}</TableCell>
                                        <TableCell className="font-mono text-xs">{item.nik}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.nama_lengkap}</div>
                                            <div className="text-xs text-base-content/50">{item.pekerjaan}</div>
                                        </TableCell>
                                        <TableCell>{item.jenis_kelamin}</TableCell>
                                        <TableCell className="hidden md:table-cell text-xs">
                                            {item.alamat}, RT {item.rt}/RW {item.rw}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-xs font-mono">
                                            {item.kartu_keluarga?.nomor_kk ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge color={statusColor(item.status_penduduk)} size="sm">
                                                {item.status_penduduk}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {item.user_id ? (
                                                <Badge color="success" size="sm">Aktif</Badge>
                                            ) : (
                                                <span className="text-base-content/40 text-xs">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                <Tooltip content="Detail">
                                                    <Button
                                                        size="sm"
                                                        color="info"
                                                        variant="soft"
                                                        circle
                                                        onClick={() => openDetail(item)}
                                                        title="Lihat Detail"
                                                    >
                                                        👁️
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <LaravelPagination data={penduduk} />
            </div>

            {/* ── Form Modal ──────────────────────────────── */}
            <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)} boxClassName="max-w-4xl w-full">
                <ModalHeader>{editingItem ? 'Edit Penduduk' : 'Tambah Penduduk'}</ModalHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody className="max-h-[70vh] overflow-y-auto">
                        <div className="space-y-6">
                            {/* Identitas Utama */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">Identitas Utama</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Controller name="nik" control={control} render={({ field }) => (
                                        <TextInput label="NIK" placeholder="16 digit NIK" {...field} error={errors.nik?.message} required />
                                    )} />
                                    <Controller name="nama_lengkap" control={control} render={({ field }) => (
                                        <TextInput label="Nama Lengkap" {...field} error={errors.nama_lengkap?.message} required />
                                    )} />
                                    <Controller name="tempat_lahir" control={control} render={({ field }) => (
                                        <TextInput label="Tempat Lahir" {...field} error={errors.tempat_lahir?.message} required />
                                    )} />
                                    <Controller name="tanggal_lahir" control={control} render={({ field }) => (
                                        <DatePickerInput
                                            label="Tanggal Lahir"
                                            selected={parseDate(field.value)}
                                            onChange={(date) => field.onChange(formatDate(date))}
                                            error={errors.tanggal_lahir?.message}
                                            placeholder="Pilih tanggal lahir"
                                            isClearable
                                        />
                                    )} />
                                    <Controller name="jenis_kelamin" control={control} render={({ field }) => (
                                        <NativeSelect label="Jenis Kelamin" options={[{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }]} {...field} error={errors.jenis_kelamin?.message} />
                                    )} />
                                    <Controller name="agama" control={control} render={({ field }) => (
                                        <NativeSelect label="Agama" options={AGAMA_OPTIONS.map((a) => ({ value: a, label: a }))} {...field} error={errors.agama?.message} />
                                    )} />
                                </div>
                            </div>

                            <div className="divider my-0" />

                            {/* Data Pribadi */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">Data Pribadi</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <Controller name="status_perkawinan" control={control} render={({ field }) => (
                                        <NativeSelect label="Status Perkawinan" options={STATUS_KAWIN_OPTIONS.map((s) => ({ value: s, label: s }))} {...field} error={errors.status_perkawinan?.message} />
                                    )} />
                                    <Controller name="pendidikan_terakhir" control={control} render={({ field }) => (
                                        <NativeSelect label="Pendidikan Terakhir" options={PENDIDIKAN_OPTIONS.map((p) => ({ value: p, label: p }))} {...field} error={errors.pendidikan_terakhir?.message} />
                                    )} />
                                    <Controller name="pekerjaan" control={control} render={({ field }) => (
                                        <TextInput label="Pekerjaan" {...field} error={errors.pekerjaan?.message} required />
                                    )} />
                                    <Controller name="kewarganegaraan" control={control} render={({ field }) => (
                                        <NativeSelect label="Kewarganegaraan" options={[{ value: 'WNI', label: 'WNI' }, { value: 'WNA', label: 'WNA' }]} {...field} />
                                    )} />
                                    <Controller name="golongan_darah" control={control} render={({ field }) => (
                                        <NativeSelect label="Golongan Darah" options={GOLDAR_OPTIONS} {...field} value={field.value ?? ''} />
                                    )} />
                                </div>
                            </div>

                            <div className="divider my-0" />

                            {/* Data Keluarga */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">Data Keluarga</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Controller name="status_hubungan_keluarga" control={control} render={({ field }) => (
                                        <NativeSelect label="Status Hubungan Keluarga" options={HUBUNGAN_OPTIONS.map((h) => ({ value: h, label: h }))} {...field} error={errors.status_hubungan_keluarga?.message} />
                                    )} />
                                    <Controller name="kartu_keluarga_id" control={control} render={({ field }) => (
                                        <NativeSelect label="Kartu Keluarga" options={kkOptions} value={field.value != null ? String(field.value) : ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} />
                                    )} />
                                    <Controller name="nama_ayah" control={control} render={({ field }) => (
                                        <TextInput label="Nama Ayah" {...field} value={field.value ?? ''} />
                                    )} />
                                    <Controller name="nama_ibu" control={control} render={({ field }) => (
                                        <TextInput label="Nama Ibu" {...field} value={field.value ?? ''} />
                                    )} />
                                </div>
                            </div>

                            <div className="divider my-0" />

                            {/* Alamat */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">Alamat</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <Controller name="alamat" control={control} render={({ field }) => (
                                            <Textarea label="Alamat Lengkap" {...field} error={errors.alamat?.message} required />
                                        )} />
                                    </div>
                                    <Controller name="rt" control={control} render={({ field }) => (
                                        <TextInput label="RT" {...field} error={errors.rt?.message} required />
                                    )} />
                                    <Controller name="rw" control={control} render={({ field }) => (
                                        <TextInput label="RW" {...field} error={errors.rw?.message} required />
                                    )} />
                                </div>
                            </div>

                            <div className="divider my-0" />

                            {/* Status & Tambahan */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">Status & Tambahan</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <Controller name="status_penduduk" control={control} render={({ field }) => (
                                        <NativeSelect label="Status Penduduk" options={STATUS_PENDUDUK_OPTIONS.map((s) => ({ value: s, label: s }))} {...field} />
                                    )} />
                                    <Controller name="telepon" control={control} render={({ field }) => (
                                        <TextInput label="Telepon" {...field} value={field.value ?? ''} />
                                    )} />
                                    <Controller name="tanggal_masuk" control={control} render={({ field }) => (
                                        <DatePickerInput
                                            label="Tanggal Masuk"
                                            selected={parseDate(field.value)}
                                            onChange={(date) => field.onChange(formatDate(date))}
                                            placeholder="Pilih tanggal masuk"
                                            isClearable
                                        />
                                    )} />
                                </div>
                                <div className="mt-4">
                                    <Controller name="catatan" control={control} render={({ field }) => (
                                        <Textarea label="Catatan" {...field} value={field.value ?? ''} />
                                    )} />
                                </div>
                            </div>

                            {/* Akun Login - hanya saat tambah baru */}
                            {!editingItem && (
                                <>
                                    <div className="divider my-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-primary mb-3">Akun Login</h4>
                                        <div className="alert alert-info mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">Buat akun warga agar penduduk dapat login dan mengajukan surat secara mandiri.</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Checkbox
                                                id="create_user"
                                                checked={createUser}
                                                onChange={(e) => setCreateUser(e.target.checked)}
                                            />
                                            <label htmlFor="create_user" className="cursor-pointer select-none">
                                                Buat akun login untuk penduduk ini
                                            </label>
                                        </div>
                                        {createUser && (
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
                                                <Controller name="user_email" control={control} render={({ field }) => (
                                                    <TextInput
                                                        label="Email"
                                                        type="email"
                                                        placeholder="contoh@email.com"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        error={errors.user_email?.message}
                                                        required={createUser}
                                                    />
                                                )} />
                                                <Controller name="user_password" control={control} render={({ field }) => (
                                                    <TextInput
                                                        label="Password"
                                                        type="password"
                                                        placeholder="Minimal 6 karakter"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        error={errors.user_password?.message}
                                                        required={createUser}
                                                    />
                                                )} />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </ModalBody>
                    <ModalAction>
                        <Button type="button" color="ghost" onClick={() => setIsFormOpen(false)}>Batal</Button>
                        <Button type="submit" color="primary" loading={isSubmitting}>
                            {editingItem ? 'Simpan Perubahan' : 'Tambah Penduduk'}
                        </Button>
                    </ModalAction>
                </form>
            </Modal>

            {/* ── Delete Modal ─────────────────────────────── */}
            <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <ModalHeader>Hapus Penduduk</ModalHeader>
                <ModalBody>
                    <p>Yakin ingin menghapus data penduduk <strong>{deletingItem?.nama_lengkap}</strong> (NIK: {deletingItem?.nik})?</p>
                    <p className="text-sm text-error mt-2">Tindakan ini tidak dapat dibatalkan.</p>
                </ModalBody>
                <ModalAction>
                    <Button color="ghost" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
                    <Button color="error" onClick={handleDelete}>Hapus</Button>
                </ModalAction>
            </Modal>

            {/* ── Detail Modal ─────────────────────────────── */}
            <Modal open={isDetailOpen} onClose={() => setIsDetailOpen(false)} boxClassName="max-w-3xl w-full">
                <ModalHeader>Detail Penduduk</ModalHeader>
                <ModalBody className="max-h-[70vh] overflow-y-auto">
                    {detailItem && (
                        <div className="space-y-4">
                            {/* Identitas Utama */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Identitas Utama</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-base-content/60">NIK:</span> <span className="font-mono">{detailItem.nik}</span></div>
                                    <div><span className="text-base-content/60">Nama Lengkap:</span> {detailItem.nama_lengkap}</div>
                                    <div><span className="text-base-content/60">Tempat/Tgl Lahir:</span> {detailItem.tempat_lahir}, {detailItem.tanggal_lahir}</div>
                                    <div><span className="text-base-content/60">Jenis Kelamin:</span> {detailItem.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                                    <div><span className="text-base-content/60">Agama:</span> {detailItem.agama}</div>
                                    <div><span className="text-base-content/60">Status Perkawinan:</span> {detailItem.status_perkawinan}</div>
                                </div>
                            </div>

                            <div className="divider my-2" />

                            {/* Data Pribadi */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Data Pribadi</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-base-content/60">Pendidikan:</span> {detailItem.pendidikan_terakhir}</div>
                                    <div><span className="text-base-content/60">Pekerjaan:</span> {detailItem.pekerjaan}</div>
                                    <div><span className="text-base-content/60">Kewarganegaraan:</span> {detailItem.kewarganegaraan}</div>
                                    <div><span className="text-base-content/60">Gol. Darah:</span> {detailItem.golongan_darah || '—'}</div>
                                </div>
                            </div>

                            <div className="divider my-2" />

                            {/* Data Keluarga */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Data Keluarga</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-base-content/60">Status Hubungan:</span> {detailItem.status_hubungan_keluarga}</div>
                                    <div><span className="text-base-content/60">No. KK:</span> {detailItem.kartu_keluarga?.nomor_kk || '—'}</div>
                                    <div><span className="text-base-content/60">Nama Ayah:</span> {detailItem.nama_ayah || '—'}</div>
                                    <div><span className="text-base-content/60">Nama Ibu:</span> {detailItem.nama_ibu || '—'}</div>
                                </div>
                            </div>

                            <div className="divider my-2" />

                            {/* Alamat */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Alamat</h4>
                                <div className="text-sm">
                                    <p>{detailItem.alamat}</p>
                                    <p className="text-base-content/60">RT {detailItem.rt}/RW {detailItem.rw}</p>
                                </div>
                            </div>

                            <div className="divider my-2" />

                            {/* Status & Tambahan */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Status & Tambahan</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-base-content/60">Status Penduduk:</span> <Badge color={statusColor(detailItem.status_penduduk)} size="sm">{detailItem.status_penduduk}</Badge></div>
                                    <div><span className="text-base-content/60">Telepon:</span> {detailItem.telepon || '—'}</div>
                                    <div><span className="text-base-content/60">Tgl Masuk:</span> {detailItem.tanggal_masuk || '—'}</div>
                                    <div><span className="text-base-content/60">Akun Login:</span> {detailItem.user_id ? <Badge color="success" size="sm">Aktif</Badge> : <span className="text-base-content/40">Tidak ada</span>}</div>
                                </div>
                                {detailItem.catatan && (
                                    <div className="mt-2">
                                        <span className="text-base-content/60 text-sm">Catatan:</span>
                                        <p className="text-sm mt-1">{detailItem.catatan}</p>
                                    </div>
                                )}
                            </div>

                            {/* Akun Login - hanya jika ada */}
                            {detailItem.user && (
                                <>
                                    <div className="divider my-2" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-primary mb-2">Akun Login</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="text-base-content/60">Email:</span> {detailItem.user.email}</div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    color="warning"
                                                    variant="soft"
                                                    onClick={handleResetPassword}
                                                    loading={isResetting}
                                                >
                                                    🔑 Reset Password
                                                </Button>
                                                <span className="text-xs text-base-content/50">Password akan direset menjadi: <strong>ardipura</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </ModalBody>
                <ModalAction>
                    <Button color="primary" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
                </ModalAction>
            </Modal>
        </StafLayout>
    );
}
