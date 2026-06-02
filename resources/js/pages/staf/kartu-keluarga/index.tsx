import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    TextInput,
    Textarea,
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
import { kartuKeluargaSchema, defaultValues, type KartuKeluargaFormValues } from './schema';
import { formatDate, parseDate, toDateString } from '@/lib/date';

// ── Types ──────────────────────────────────────────────────

interface Anggota {
    id: number;
    kartu_keluarga_id: number;
    nama_lengkap: string;
    status_hubungan_keluarga: string;
}

interface KartuKeluarga {
    id: number;
    nomor_kk: string;
    alamat: string;
    rt: string;
    rw: string;
    kelurahan: string;
    kecamatan: string;
    kabupaten_kota: string;
    provinsi: string;
    kode_pos: string | null;
    tanggal_dikeluarkan: string | null;
    anggota_count: number;
    anggota: Anggota[];
}

interface PaginatedData {
    data: KartuKeluarga[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    kartuKeluarga: PaginatedData;
    filters: { search: string };
}

// ── Component ──────────────────────────────────────────────

export default function KartuKeluargaIndex({ kartuKeluarga, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<KartuKeluarga | null>(null);
    const [deletingItem, setDeletingItem] = useState<KartuKeluarga | null>(null);
    const [detailItem, setDetailItem] = useState<KartuKeluarga | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<KartuKeluargaFormValues>({
        resolver: yupResolver(kartuKeluargaSchema),
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
        router.get('/staf/kartu-keluarga', {
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

    const openCreate = () => {
        setEditingItem(null);
        reset(defaultValues);
        setIsFormOpen(true);
    };

    const openEdit = (item: KartuKeluarga) => {
        setEditingItem(item);
        reset({
            nomor_kk: item.nomor_kk,
            alamat: item.alamat,
            rt: item.rt,
            rw: item.rw,
            kelurahan: item.kelurahan,
            kecamatan: item.kecamatan,
            kabupaten_kota: item.kabupaten_kota,
            provinsi: item.provinsi,
            kode_pos: item.kode_pos,
            tanggal_dikeluarkan: item.tanggal_dikeluarkan,
        });
        setIsFormOpen(true);
    };

    const openDetail = (item: KartuKeluarga) => {
        setDetailItem(item);
        setIsDetailOpen(true);
    };

    const openDelete = (item: KartuKeluarga) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    // ── Submit ──────────────────────────────────────────────

    const onSubmit = (values: KartuKeluargaFormValues) => {
        setIsSubmitting(true);
        const url = editingItem ? `/staf/kartu-keluarga/${editingItem.id}` : '/staf/kartu-keluarga';

        const options = {
            preserveScroll: true,
            onError: (serverErrors: Record<string, string>) => {
                let firstMsg = '';
                Object.entries(serverErrors).forEach(([field, message]) => {
                    if (!firstMsg) firstMsg = message;
                    setError(field as keyof KartuKeluargaFormValues, { type: 'server', message });
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
        router.delete(`/staf/kartu-keluarga/${deletingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingItem(null);
            },
            onError: () => showError('Gagal menghapus data.'),
        });
    };

    /** Kepala Keluarga name from eager-loaded anggota */
    const getKepala = (item: KartuKeluarga): string => {
        const kepala = item.anggota?.find((a) => a.status_hubungan_keluarga === 'Kepala Keluarga');
        return kepala?.nama_lengkap ?? '—';
    };

    return (
        <StafLayout
            title="Kartu Keluarga"
            breadcrumbs={[
                { label: 'Dashboard', href: '/staf' },
                { label: 'Kartu Keluarga' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Kartu Keluarga</h1>
                        <p className="text-base-content/60 mt-1">Kelola data Kartu Keluarga Kelurahan Ardipura</p>
                    </div>
                    <Button color="primary" onClick={openCreate}>
                        + Tambah KK
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
                                    placeholder="Cari nomor KK, alamat, atau nama kepala keluarga..."
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
                            Menampilkan {kartuKeluarga.from ?? 0}–{kartuKeluarga.to ?? 0} dari {kartuKeluarga.total} kartu keluarga
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow overflow-x-auto">
                    <Table className="table-sm">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>No</TableHeaderCell>
                                <TableHeaderCell>Nomor KK</TableHeaderCell>
                                <TableHeaderCell>Kepala Keluarga</TableHeaderCell>
                                <TableHeaderCell className="hidden md:table-cell">Alamat</TableHeaderCell>
                                <TableHeaderCell className="hidden lg:table-cell">RT/RW</TableHeaderCell>
                                <TableHeaderCell>Anggota</TableHeaderCell>
                                <TableHeaderCell className="text-center">Aksi</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {kartuKeluarga.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-base-content/50">
                                        Belum ada data Kartu Keluarga.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kartuKeluarga.data.map((item, i) => (
                                    <TableRow key={item.id} className="hover">
                                        <TableCell>{(kartuKeluarga.from ?? 1) + i}</TableCell>
                                        <TableCell className="font-mono text-xs">{item.nomor_kk}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{getKepala(item)}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-xs">
                                            {item.alamat}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-xs">
                                            {item.rt}/{item.rw}
                                        </TableCell>
                                        <TableCell>
                                            <Badge color="info" size="sm">
                                                {item.anggota_count} orang
                                            </Badge>
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

                <LaravelPagination data={kartuKeluarga} />
            </div>

            {/* ── Form Modal ──────────────────────────────── */}
            <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)} boxClassName="max-w-3xl w-full">
                <ModalHeader>{editingItem ? 'Edit Kartu Keluarga' : 'Tambah Kartu Keluarga'}</ModalHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody className="max-h-[70vh] overflow-y-auto">
                        <div className="space-y-6">
                            {/* Identitas KK */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">Identitas Kartu Keluarga</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Controller name="nomor_kk" control={control} render={({ field }) => (
                                        <TextInput label="Nomor KK" placeholder="16 digit Nomor KK" {...field} error={errors.nomor_kk?.message} required />
                                    )} />
                                    <Controller name="tanggal_dikeluarkan" control={control} render={({ field }) => (
                                        <DatePickerInput
                                            label="Tanggal Dikeluarkan"
                                            selected={parseDate(field.value)}
                                            onChange={(date) => field.onChange(toDateString(date))}
                                            error={errors.tanggal_dikeluarkan?.message}
                                            placeholder="Pilih tanggal"
                                            isClearable
                                        />
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
                                        <TextInput label="RT" placeholder="001" {...field} error={errors.rt?.message} required />
                                    )} />
                                    <Controller name="rw" control={control} render={({ field }) => (
                                        <TextInput label="RW" placeholder="001" {...field} error={errors.rw?.message} required />
                                    )} />
                                </div>
                            </div>

                            <div className="divider my-0" />

                            {/* Wilayah Administratif */}
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">Wilayah Administratif</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Controller name="kelurahan" control={control} render={({ field }) => (
                                        <TextInput label="Kelurahan" {...field} error={errors.kelurahan?.message} />
                                    )} />
                                    <Controller name="kecamatan" control={control} render={({ field }) => (
                                        <TextInput label="Kecamatan" {...field} error={errors.kecamatan?.message} />
                                    )} />
                                    <Controller name="kabupaten_kota" control={control} render={({ field }) => (
                                        <TextInput label="Kabupaten / Kota" {...field} error={errors.kabupaten_kota?.message} />
                                    )} />
                                    <Controller name="provinsi" control={control} render={({ field }) => (
                                        <TextInput label="Provinsi" {...field} error={errors.provinsi?.message} />
                                    )} />
                                    <Controller name="kode_pos" control={control} render={({ field }) => (
                                        <TextInput label="Kode Pos" placeholder="99224" {...field} value={field.value ?? ''} />
                                    )} />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalAction>
                        <Button type="button" color="ghost" onClick={() => setIsFormOpen(false)}>Batal</Button>
                        <Button type="submit" color="primary" loading={isSubmitting}>
                            {editingItem ? 'Simpan Perubahan' : 'Tambah KK'}
                        </Button>
                    </ModalAction>
                </form>
            </Modal>

            {/* ── Detail Modal ─────────────────────────────── */}
            <Modal open={isDetailOpen} onClose={() => setIsDetailOpen(false)} boxClassName="max-w-2xl w-full">
                <ModalHeader>Detail Kartu Keluarga</ModalHeader>
                <ModalBody>
                    {detailItem && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                <div>
                                    <span className="text-base-content/50">Nomor KK</span>
                                    <p className="font-mono font-semibold">{detailItem.nomor_kk}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50">Kepala Keluarga</span>
                                    <p className="font-semibold">{getKepala(detailItem)}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-base-content/50">Alamat</span>
                                    <p>{detailItem.alamat}, RT {detailItem.rt}/RW {detailItem.rw}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50">Kelurahan</span>
                                    <p>{detailItem.kelurahan}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50">Kecamatan</span>
                                    <p>{detailItem.kecamatan}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50">Kabupaten / Kota</span>
                                    <p>{detailItem.kabupaten_kota}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50">Provinsi</span>
                                    <p>{detailItem.provinsi}</p>
                                </div>
                                {detailItem.kode_pos && (
                                    <div>
                                        <span className="text-base-content/50">Kode Pos</span>
                                        <p>{detailItem.kode_pos}</p>
                                    </div>
                                )}
                                {detailItem.tanggal_dikeluarkan && (
                                    <div>
                                        <span className="text-base-content/50">Tanggal Dikeluarkan</span>
                                        <p>{formatDate(detailItem.tanggal_dikeluarkan)}</p>
                                    </div>
                                )}
                            </div>

                            <div className="divider my-0" />

                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">
                                    Jumlah Anggota: <Badge color="info" size="sm">{detailItem.anggota_count} orang</Badge>
                                </h4>
                                <p className="text-xs text-base-content/50">
                                    Untuk melihat daftar anggota lengkap, buka halaman <a href="/staf/penduduk" className="link link-primary">Penduduk</a> dan cari berdasarkan nomor KK.
                                </p>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalAction>
                    <Button color="ghost" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
                    {detailItem && (
                        <Button color="warning" onClick={() => { setIsDetailOpen(false); openEdit(detailItem); }}>
                            Edit KK
                        </Button>
                    )}
                </ModalAction>
            </Modal>

            {/* ── Delete Modal ─────────────────────────────── */}
            <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <ModalHeader>Hapus Kartu Keluarga</ModalHeader>
                <ModalBody>
                    <p>Yakin ingin menghapus Kartu Keluarga <strong>{deletingItem?.nomor_kk}</strong>?</p>
                    {deletingItem && deletingItem.anggota_count > 0 && (
                        <div className="mt-3 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                            <p className="text-sm text-warning font-medium">
                                ⚠️ KK ini masih memiliki {deletingItem.anggota_count} anggota. Hapus atau pindahkan semua anggota terlebih dahulu.
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
